import React from 'react';
import { PDFDocument } from 'pdf-lib';

interface CreatePDFProps {
  pdfFile: File;
  selectedPages: number[];
}

const CreatePDF: React.FC<CreatePDFProps> = ({ pdfFile, selectedPages }) => {
  const handleCreatePDF = async () => {
    try {
      const existingPdfBytes = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const newPdfDoc = await PDFDocument.create();

      for (const pageNumber of selectedPages) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNumber - 1]);
        newPdfDoc.addPage(copiedPage);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'extracted_pages.pdf';
      link.click();
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('An error occurred while creating the PDF. Please try again.');
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={handleCreatePDF}
        disabled={selectedPages.length === 0}
        className={`w-full py-2 px-4 rounded ${
          selectedPages.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Create PDF with Selected Pages
      </button>
    </div>
  );
};

export default CreatePDF;

