import express from 'express';
import cors from 'cors';
import { createPDFRouter } from './interfaces/routes/pdf-routes';
import { PDFController } from './interfaces/controllers/pdf-controller';
import { PDFUseCasesImpl } from './application/use-cases/pdf-use-cases-impl';
import { FSPDFRepository } from './infrastructure/repositories/pdf-repository';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Range', 'Accept-Ranges', 'Content-Range'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges']
}));

app.use(express.json());

app.use('/uploads', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': FRONTEND_URL,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Range',
    'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges',
    'Content-Type': 'application/pdf',
    'Accept-Ranges': 'bytes'
  });
  next();
}, express.static(path.join(__dirname, '../uploads')));

const pdfRepository = new FSPDFRepository();
const pdfUseCases = new PDFUseCasesImpl(pdfRepository);
const pdfController = new PDFController(pdfUseCases);

app.use('/api/pdf', createPDFRouter(pdfController));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});