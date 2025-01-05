import { HttpStatus } from '../../constants/http-status';
export class PDFController {
    constructor(pdfUseCases) {
        this.pdfUseCases = pdfUseCases;
    }
    async uploadPdf(req, res) {
        try {
            if (!req.file) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: "No file uploaded" });
                return;
            }
            const pdf = await this.pdfUseCases.uploadPDF(req.file);
            res.status(HttpStatus.OK).json({
                success: true,
                message: "File uploaded successfully",
                filename: pdf.filename
            });
        }
        catch (error) {
            console.error("Upload error:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred during file upload"
            });
        }
    }
    async getPageCount(req, res) {
        try {
            const { filename } = req.params;
            const pageCount = await this.pdfUseCases.getPageCount(filename);
            res.status(HttpStatus.OK).json({ pageCount });
        }
        catch (error) {
            console.error("Error getting PDF page count:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Failed to get PDF page count"
            });
        }
    }
    async extractPages(req, res) {
        try {
            const { filename } = req.params;
            const { selectedPages } = req.body;
            const pdfBuffer = await this.pdfUseCases.extractPages(filename, selectedPages);
            res.status(HttpStatus.OK)
                .setHeader('Content-Type', 'application/pdf')
                .setHeader('Content-Disposition', 'attachment; filename=extracted_pages.pdf')
                .send(pdfBuffer);
        }
        catch (error) {
            console.error("Error extracting PDF pages:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                error: "Failed to extract PDF pages"
            });
        }
    }
}
