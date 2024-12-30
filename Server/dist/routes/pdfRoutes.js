import express from "express";
import { upload } from '../middleware/uploadMiddleware';
import { uploadPdf, getPageCount, extractPages } from '../controller/pdfController';
const router = express.Router();
// Route to handle PDF upload
router.post('/upload', upload.single('pdf'), uploadPdf);
// Route to get page count of a PDF by filename
router.get('/page-count/:filename', getPageCount);
// Route to extract selected pages from a PDF
router.post('/extract/:filename', extractPages);
router.get('/test', (req, res) => {
    res.json({
        message: 'Test endpoint working!',
        cors: 'CORS is properly configured if you see this message',
        timestamp: new Date().toISOString()
    });
});
export default router;
