import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import { pdfService } from "../services/pdfService";

interface FileUploadProps {
  onFileUpload: (filename: string) => void;
  setTotalPages: (pages: number) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  setTotalPages
}) => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  // const onDrop = useCallback(
  //   async (acceptedFiles: File[], rejectedFiles: any[]) => {
  //     if (rejectedFiles.length > 0) {
  //       handleRejectedFiles(rejectedFiles);
  //       return;
  //     }

  //     const file = acceptedFiles[0];
  //     if (file) {
  //       if (!validateFile(file)) return;

  //       try {
  //         const uploadResponse = await pdfService.uploadPDF(file);
  //         const pageCountResponse = await pdfService.getPageCount(
  //           uploadResponse.filename
  //         );

  //         onFileUpload(uploadResponse.filename);
  //         setTotalPages(pageCountResponse.pageCount);
  //         toast.success("File uploaded successfully");
  //       } catch (error: any) {
  //         console.error("Upload failed:", error);
  //         const errorMessage =
  //           error.response?.data?.message ||
  //           "Failed to upload PDF. Please try again.";
  //         toast.error(errorMessage);
  //       }
  //     }
  //   },
  //   [onFileUpload, setTotalPages]
  // );
  // const onDrop = useCallback(
  //   async (acceptedFiles: File[], rejectedFiles: any[]) => {
  //     if (rejectedFiles.length > 0) {
  //       handleRejectedFiles(rejectedFiles);
  //       return;
  //     }
  
  //     const file = acceptedFiles[0];
  //     if (file) {
  //       if (!validateFile(file)) return;
  
  //       try {
  //         const uploadResponse = await pdfService.uploadPDF(file);
  //         if (uploadResponse.success) {
  //           const filename = uploadResponse.filename;
  //           const pageCountResponse = await pdfService.getPageCount(filename);
  
  //           onFileUpload(filename);
  //           setTotalPages(pageCountResponse.pageCount);
  //           toast.success('File uploaded successfully');
  //         } else {
  //           toast.error(uploadResponse.message || 'Upload failed');
  //         }
  //       } catch (error: any) {
  //         console.error("Upload failed:", error);
  //         const errorMessage = error.response?.data?.message || 'Failed to upload PDF. Please try again.';
  //         toast.error(errorMessage);
  //       }
  //     }
  //   },
  //   [onFileUpload, setTotalPages]
  // );


  // FileUpload.tsx
const onDrop = useCallback(
  async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      handleRejectedFiles(rejectedFiles);
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      if (!validateFile(file)) return;

      try {
        const uploadResponse = await pdfService.uploadPDF(file);
        if (uploadResponse.success) {
          // Use the clean filename
          const filename = uploadResponse.filename;
          const pageCountResponse = await pdfService.getPageCount(filename);

          onFileUpload(filename);
          setTotalPages(pageCountResponse.pageCount);
          toast.success('File uploaded successfully');
        } else {
          toast.error(uploadResponse.message || 'Upload failed');
        }
      } catch (error: any) {
        console.error("Upload failed:", error);
        const errorMessage = error.response?.data?.message || 'Failed to upload PDF. Please try again.';
        toast.error(errorMessage);
      }
    }
  },
  [onFileUpload, setTotalPages]
);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "application/pdf": [".pdf"] },
      multiple: false,
      maxSize: MAX_FILE_SIZE,
      validator: (file: File) => {
        if (file.type !== "application/pdf") {
          return {
            code: "file-invalid-type",
            message: "Only PDF files are allowed"
          };
        }
        return null;
      }
    });

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10MB");
      return false;
    }

    if (!file.type || file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return false;
    }

    return true;
  };

  const handleRejectedFiles = (rejectedFiles: any[]) => {
    const errors = rejectedFiles[0].errors;
    if (errors.some((e: any) => e.code === "file-invalid-type")) {
      toast.error("Only PDF files are allowed");
    }
    if (errors.some((e: any) => e.code === "file-too-large")) {
      toast.error("File size must be less than 10MB");
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 
        ${
          isDragReject
            ? "border-red-500 bg-red-50"
            : isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-500"
        }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        {isDragReject ? (
          <p className="text-red-500">
            File type not accepted or size too large
          </p>
        ) : isDragActive ? (
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
