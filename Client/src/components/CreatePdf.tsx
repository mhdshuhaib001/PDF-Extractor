import { useState } from "react";
import { toast } from "react-hot-toast";
import { downloadBlob } from "../utils/fileUtils";
import { pdfService } from "../services/pdfService";


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
      const blob = await pdfService.extractPages(filename, selectedPages);
      downloadBlob(blob, "extracted_pages.pdf");
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