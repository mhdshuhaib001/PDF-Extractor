import { PDFDocument } from "pdf-lib";
import fs from "fs";
export async function extractedPdfPages(inputPath, selectedPage) {
    try {
        const exixtingPdfBytes = await fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(exixtingPdfBytes);
        const newPdfDoc = await PDFDocument.create();
        for (const pageNumber of selectedPage) {
            const [copidPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
            newPdfDoc.addPage(copidPage);
        }
        const pdfBytes = await newPdfDoc.save();
        return Buffer.from(pdfBytes);
    }
    catch (error) {
        console.error("Error extracting PDF pages:", error);
        throw new Error("Failed to extract PDF pages");
    }
}
