import { PDFRepository } from '../../domain/repositories/pdf-repository.interface';
import { PDF } from '../../domain/entities/pdf';
import { PDFDocument } from 'pdf-lib';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

export class FSPDFRepository implements PDFRepository {
  async save(file: Express.Multer.File): Promise<PDF> {
    // File is already uploaded to Cloudinary by multer
    const pdfBuffer = await axios.get(file.path, { responseType: 'arraybuffer' });
    const pdfDoc = await PDFDocument.load(pdfBuffer.data);
    
    return {
      filename: file.filename,
      path: file.path,
      pageCount: pdfDoc.getPageCount()
    };
  }

  async findByFilename(filename: string): Promise<PDF> {
    const cleanFilename = filename.replace('pdfs/', '');
    const url = this.getFileUrl(cleanFilename);
    
    try {
      const pdfBuffer = await axios.get(url, { responseType: 'arraybuffer' });
      const pdfDoc = await PDFDocument.load(pdfBuffer.data);

      return {
        filename: cleanFilename,
        path: url,
        pageCount: pdfDoc.getPageCount()
      };
    } catch (error) {
      console.error('Error finding PDF:', error);
      throw new Error('PDF not found or inaccessible');
    }
  }


  async getPageCount(filename: string): Promise<number> {
    const pdf = await this.findByFilename(filename);
    return pdf.pageCount;
  }

  async extractPages(filename: string, selectedPages: number[]): Promise<Buffer> {
    const url = this.getFileUrl(filename);
    const pdfBuffer = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfDoc = await PDFDocument.load(pdfBuffer.data);
    const newPdfDoc = await PDFDocument.create();

    for (const pageNumber of selectedPages) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
      newPdfDoc.addPage(copiedPage);
    }

    return Buffer.from(await newPdfDoc.save());
  }

  private getFileUrl(filename: string): string {
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/pdfs/${filename}`;
  }
}
