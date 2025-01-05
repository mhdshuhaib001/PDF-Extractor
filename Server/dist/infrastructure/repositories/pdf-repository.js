import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class FSPDFRepository {
    constructor() {
        this.uploadDir = path.join(__dirname, '..', '..', '..', 'uploads');
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async save(file) {
        const pdfBytes = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        return {
            filename: file.filename,
            path: file.path,
            pageCount: pdfDoc.getPageCount()
        };
    }
    async findByFilename(filename) {
        const filePath = path.join(this.uploadDir, filename);
        if (!fs.existsSync(filePath)) {
            throw new Error('File not found');
        }
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        return {
            filename,
            path: filePath,
            pageCount: pdfDoc.getPageCount()
        };
    }
    async getPageCount(filename) {
        const pdf = await this.findByFilename(filename);
        return pdf.pageCount;
    }
    async extractPages(filename, selectedPages) {
        const filePath = path.join(this.uploadDir, filename);
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const newPdfDoc = await PDFDocument.create();
        for (const pageNumber of selectedPages) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
            newPdfDoc.addPage(copiedPage);
        }
        return Buffer.from(await newPdfDoc.save());
    }
}
