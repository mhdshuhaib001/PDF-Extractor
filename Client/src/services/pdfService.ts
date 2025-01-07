import axiosInstance from "../lib/axios";

export interface UploadResponse {
  filename: string;
  url: string;
  success: boolean;
  message: string;
}

export interface PageCountResponse {
  pageCount: number;
}

export const pdfService = {
  async uploadPDF(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("pdf", file);
    const response = await axiosInstance.post<UploadResponse>(
      "/api/pdf/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

    console.log(response,'this is the frontend response')
    return response.data;
  },

  async getPageCount(filename: string): Promise<PageCountResponse> {
    // Remove the 'pdfs/' prefix if it exists
    const cleanFilename = filename.replace("pdfs/", "");
    const response = await axiosInstance.get<PageCountResponse>(
      `/api/pdf/page-count/${cleanFilename}`
    );
    console.log(response.data);
    return {
      pageCount: response.data.pageCount
    };
  },

  async extractPages(filename: string, selectedPages: number[]): Promise<Blob> {
    // Remove the 'pdfs/' prefix if it exists
    const cleanFilename = filename.replace("pdfs/", "");
    const response = await axiosInstance.post(
      `/api/pdf/extract/${cleanFilename}`,
      { selectedPages },
      { responseType: "blob" }
    );
    return response.data;
  },

  getPDFUrl(filename: string): string {
    const cleanFilename = filename.replace(/^pdfs\//, "");

    return `https://res.cloudinary.com/${
      import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME
    }/raw/upload/pdfs/${cleanFilename}`;
  }
};
