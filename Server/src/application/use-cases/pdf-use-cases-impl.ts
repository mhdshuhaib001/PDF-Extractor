import { PDFUseCases } from '../../domain/use-cases/pdf-use-cases';
import { PDFRepository } from '../../domain/repositories/pdf-repository.interface';
import { PDF } from '../../domain/entities/pdf';

export class PDFUseCasesImpl implements PDFUseCases {
  constructor(private pdfRepository: PDFRepository) {}

  async uploadPDF(file: Express.Multer.File): Promise<PDF> {
    return this.pdfRepository.save(file);
  }

  async getPageCount(filename: string): Promise<number> {
    return this.pdfRepository.getPageCount(filename);
  }

  async extractPages(filename: string, selectedPages: number[]): Promise<Buffer> {
    return this.pdfRepository.extractPages(filename, selectedPages);
  }
}