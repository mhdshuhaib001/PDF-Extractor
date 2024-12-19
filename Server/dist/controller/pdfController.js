// src/controllers/pdfController.ts
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const uploadPdf = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        console.log("Uploaded file path:", req.file.path);
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            filename: req.file.filename,
            filePath: req.file.path
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
        // Updated uploadDir to point to the root-level uploads folder
        const uploadDir = path.join(__dirname, "..", "..", "uploads");
        const filePath = path.join(uploadDir, filename);
        console.log("File path being accessed:", filePath); // Log the file path for debugging
        if (!fs.existsSync(filePath)) {
            console.error("File not found at path:", filePath);
            res.status(404).json({ error: "File not found" });
            return;
        }
        const pdfBuffer = fs.readFileSync(filePath);
        console.log(pdfBuffer, 'pdfBuffer');
        const pdfParse = (await import("pdf-parse")).default;
        const data = await pdfParse(pdfBuffer);
        res.json({ totalPages: data.numpages });
        return;
    }
    catch (error) {
        console.error("Error getting PDF page count:", error);
        res.status(500).json({ error: "Failed to get PDF page count" });
        return;
    }
};
