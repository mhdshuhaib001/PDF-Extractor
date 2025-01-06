import express from 'express';
import { PDFController } from '../controllers/pdf-controller';
import { upload } from '../../infrastructure/middleware/upload-middleware';

export const createPDFRouter = (pdfController: PDFController) => {
  const router = express.Router();

  router.post('/upload', upload.single('pdf'), (req, res) => pdfController.uploadPdf(req, res));
  router.get('/page-count/:filename', (req, res) => pdfController.getPageCount(req, res));
  router.post('/extract/:filename', (req, res) => pdfController.extractPages(req, res));
  router.get('/   ', (req, res) => {
    res.json({ 
      message: 'Test endpoint working!',
      cors: 'CORS is properly configured if you see this message',
      timestamp: new Date().toISOString()
    });
  });

  return router;
};
