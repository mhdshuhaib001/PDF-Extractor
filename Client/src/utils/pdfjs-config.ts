// src/lib/pdfjs-config.ts
import * as pdfjs from 'pdfjs-dist';

// Configure the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default pdfjs;