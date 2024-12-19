import express from "express";
import { upload } from '../middleware/uploadMiddleware';
import { uploadPdf,getPageCount,extractPages } from '../controller/pdfController';

const router = express.Router();

router.post('/upload', upload.single('pdf'), uploadPdf);
router.get('/page-count/:filename',getPageCount)
router.post('/extract/:filename', extractPages);


export default router;