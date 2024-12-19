// src/index.ts
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import pdfRoutes from './routes/pdfRoutes';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
// Serve files from the root-level uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads'))); // Point to root uploads
app.use('/api/pdf', pdfRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
