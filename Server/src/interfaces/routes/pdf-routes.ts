import express from 'express';
import { PDFController } from '../controllers/pdf-controller';
import { upload } from '../../infrastructure/middleware/upload-middleware';

export const createPDFRouter = (pdfController: PDFController) => {
  const router = express.Router();

  router.post('/upload', upload.single('pdf'), (req, res) => pdfController.uploadPdf(req, res));
  router.get('/page-count/:filename', (req, res) => pdfController.getPageCount(req, res));
  router.post('/extract/:filename', (req, res) => pdfController.extractPages(req, res));
  router.get('/test', (req, res) => {
    try {
      // Test Cloudinary configuration
      const cloudinaryConfig = {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
      };
  
      res.json({ 
        status: 'success',
        message: 'Backend is working correctly',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        cloudinaryConfig
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Backend test failed',
      });
    }
  });

  return router;
};
