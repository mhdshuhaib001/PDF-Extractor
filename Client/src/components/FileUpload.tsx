import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
interface FileUploadProps {
  onFileUpload: (filename: string) => void;
  setTotalPages: (pages: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  setTotalPages
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const formData = new FormData();
        formData.append("pdf", file);

        try {
          const uploadResponse = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/pdf/upload`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" }
            }
          );

          const pageCountResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/pdf/page-count/${uploadResponse.data.filename}`
          );

          onFileUpload(uploadResponse.data.filename);
          setTotalPages(pageCountResponse.data.pageCount);
        } catch (error) {
          console.error("Upload failed:", error);
          toast.error("Failed to upload PDF. Please try again.");
        }
      }
    },
    [onFileUpload, setTotalPages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors duration-200"
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        {isDragActive ? (
          <p className="text-blue-500">Drop the PDF here...</p>
        ) : (
          <>
            <p className="text-gray-600">
              Drag and drop a PDF here, or click to select
            </p>
            <p className="text-sm text-gray-400">PDF files only, up to 10MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
