import { PDF } from "../entities/pdf";
export interface PDFRepository {
    save(file: Express.Multer.File): Promise<PDF>;
    findByFilename(filename: string): Promise<PDF>;
    getPageCount(filename: string): Promise<number>;
    extractPages(filename: string, selectedPages: number[]): Promise<Buffer>;
  }