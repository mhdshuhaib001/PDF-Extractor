import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import pdfRoutes from './routes/pdfRoutes';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port in production
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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

app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
