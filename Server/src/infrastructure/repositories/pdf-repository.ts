import { PDFRepository } from '../../domain/repositories/pdf-repository.interface';
import { PDF } from '../../domain/entities/pdf';
import { PDFDocument } from 'pdf-lib';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

export class FSPDFRepository implements PDFRepository {
  private async fetchPDFBuffer(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 15000,
        maxContentLength: 10 * 1024 * 1024, 
      });
      return Buffer.from(response.data);
    } catch (error) {
      console.error('Error fetching PDF:', error);
      throw new Error('Failed to fetch PDF from Cloudinary');
    }
  }

  async getPageCount(filename: string): Promise<number> {
    try {
      const cleanFilename = filename.replace(/^pdfs\//, '');
      const url = this.getFileUrl(cleanFilename);
      
      const pdfBuffer = await this.fetchPDFBuffer(url);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      
      const pageCount = pdfDoc.getPageCount();
      
      if (!pageCount || pageCount < 1) {
        throw new Error('Invalid page count');
      }
      
      return pageCount;
    } catch (error) {
      console.error('Error in getPageCount:', error);
      throw new Error('Failed to get PDF page count');
    }
  }

  async findByFilename(filename: string): Promise<PDF> {
    try {
      const cleanFilename = filename.replace(/^pdfs\//, '');
      const url = this.getFileUrl(cleanFilename);
      
      const pdfBuffer = await this.fetchPDFBuffer(url);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      
      return {
        filename: cleanFilename,
        path: url,
        pageCount: pdfDoc.getPageCount()
      };
    } catch (error) {
      console.error('Error in findByFilename:', error);
      throw new Error('PDF not found or inaccessible');
    }
  }

  private getFileUrl(filename: string): string {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary configuration missing');
    }
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/pdfs/${filename}`;
  }

  async save(file: Express.Multer.File): Promise<PDF> {
    try {
      if (!file.path) {
        throw new Error('File upload failed - no path available');
      }

      const pdfBuffer = await this.fetchPDFBuffer(file.path);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      
      return {
        filename: file.filename,
        path: file.path,
        pageCount: pdfDoc.getPageCount()
      };
    } catch (error) {
      console.error('Error in save:', error);
      throw new Error('Failed to save PDF');
    }
  }

  async extractPages(filename: string, selectedPages: number[]): Promise<Buffer> {
    try {
      const cleanFilename = filename.replace(/^pdfs\//, '');
      const url = this.getFileUrl(cleanFilename);
      
      const pdfBuffer = await this.fetchPDFBuffer(url);
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const newPdfDoc = await PDFDocument.create();

      for (const pageNumber of selectedPages) {
        if (pageNumber > pdfDoc.getPageCount()) {
          throw new Error(`Invalid page number: ${pageNumber}`);
        }
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
        newPdfDoc.addPage(copiedPage);
      }

      return Buffer.from(await newPdfDoc.save());
    } catch (error) {
      console.error('Error in extractPages:', error);
      throw new Error('Failed to extract PDF pages');
    }
  }
}