import { PDF } from "../entities/pdf";
export interface PDFUseCases {
  uploadPDF(file: Express.Multer.File): Promise<PDF>;
  getPageCount(filename: string): Promise<number>;
  extractPages(filename: string, selectedPages: number[]): Promise<Buffer>;
}
