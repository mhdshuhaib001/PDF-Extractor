export class PDFUseCasesImpl {
    constructor(pdfRepository) {
        this.pdfRepository = pdfRepository;
    }
    async uploadPDF(file) {
        return this.pdfRepository.save(file);
    }
    async getPageCount(filename) {
        return this.pdfRepository.getPageCount(filename);
    }
    async extractPages(filename, selectedPages) {
        return this.pdfRepository.extractPages(filename, selectedPages);
    }
}
