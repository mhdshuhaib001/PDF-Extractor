import axiosInstance from '../lib/axios';

export interface UploadResponse {
  filename: string;
}

export interface PageCountResponse {
  pageCount: number;
}

export const pdfService = {
  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("pdf", file);
    
    const response = await axiosInstance.post<UploadResponse>(
      '/api/pdf/upload',
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );
    return response.data;
  },

  async getPageCount(filename: string): Promise<PageCountResponse> {
    const response = await axiosInstance.get<PageCountResponse>(
      `/api/pdf/page-count/${filename}`
    );
    return response.data;
  },

  async extractPages(filename: string, selectedPages: number[]): Promise<Blob> {
    const response = await axiosInstance.post(
      `/api/pdf/extract/${filename}`,
      { selectedPages },
      { responseType: "blob" }
    );
    return response.data;
  },

  getPDFUrl(filename: string): string {
    return `${axiosInstance.defaults.baseURL}/uploads/${filename}`;
  }
};
