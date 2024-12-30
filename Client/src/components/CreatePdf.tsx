import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface CreatePDFProps {
  filename: string;
  selectedPages: number[];
}

const CreatePDF: React.FC<CreatePDFProps> = ({ filename, selectedPages }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreatePDF = async () => {
    if (selectedPages.length === 0) {
      toast.error("Please select at least one page to extract.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pdf/extract/${filename}`,
        // `https://pdf-lux.vercel.app/api/pdf/extract/${filename}`,

        { selectedPages },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "extracted_pages.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("PDF created successfully!");
    } catch (error) {
      console.error("Error creating PDF:", error);
      toast.error("Failed to create PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <button
        disabled={selectedPages.length === 0 || isLoading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${
          selectedPages.length === 0 || isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-sky-500 text-white hover:bg-sky-300"
        }`}
        onClick={handleCreatePDF}
      >
        {isLoading ? "Processing..." : "Extract Selected Pages"}
      </button>
    </div>
  );
};

export default CreatePDF;