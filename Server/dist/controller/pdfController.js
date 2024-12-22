import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            filename: req.file.filename
        });
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during file upload"
        });
    }
};
export const getPageCount = async (req, res) => {
    try {
        const { filename } = req.params;
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        const filePath = path.join(uploadDir, filename);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: "File not found" });
            return;
        }
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pageCount = pdfDoc.getPageCount();
        res.json({ pageCount });
    }
    catch (error) {
        console.error("Error getting PDF page count:", error);
        res.status(500).json({ error: "Failed to get PDF page count" });
    }
};
export const extractPages = async (req, res) => {
    try {
        const { filename } = req.params;
        const { selectedPages } = req.body;
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        const filePath = path.join(uploadDir, filename);
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ error: "File not found" });
            return;
        }
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const newPdfDoc = await PDFDocument.create();
        for (const pageNumber of selectedPages) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
            newPdfDoc.addPage(copiedPage);
        }
        const newPdfBytes = await newPdfDoc.save();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=extracted_pages.pdf');
        res.send(Buffer.from(newPdfBytes));
    }
    catch (error) {
        console.error("Error extracting PDF pages:", error);
        res.status(500).json({ error: "Failed to extract PDF pages" });
    }
};
