
import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { pdfService } from "../services/pdfService";
import PagePreview from "./PagePreview";

interface PageSelectorProps {
  totalPages: number;
  selectedPages: number[];
  onPageSelection: (pages: number[]) => void;
  filename: string;
}

const PageSelector: React.FC<PageSelectorProps> = ({
  totalPages,
  selectedPages,
  onPageSelection,
  filename
}) => {
  const [pageImages, setPageImages] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [selectionOrder, setSelectionOrder] = useState<number[]>([]);

  useEffect(() => {
    const loadPDF = async () => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument(pdfService.getPDFUrl(filename));

        const pdf = await loadingTask.promise;
        await loadPagePreviews(pdf);
      } catch (error) {
        console.error("Error loading PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    if (filename) {
      loadPDF();
    }
  }, [filename]);

  const loadPagePreviews = async (pdf: any) => {
    const images: { [key: number]: string } = {};
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.5 });
  
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
  
      await page.render({
        canvasContext: context!,
        viewport: viewport,
      }).promise;
  
      images[pageNum] = canvas.toDataURL();
      setPageImages(prevImages => ({ ...prevImages, [pageNum]: images[pageNum] }));
    }
  };

  const handlePageToggle = (pageNumber: number) => {
    let newOrder: number[];
    if (selectedPages.includes(pageNumber)) {
      // Remove the page from selection order
      newOrder = selectionOrder.filter(num => num !== pageNumber);
      setSelectionOrder(newOrder);
    } else {
      // Add the page to selection order
      newOrder = [...selectionOrder, pageNumber];
      setSelectionOrder(newOrder);
    }
    
    onPageSelection(newOrder);
  };

  if (loading) {
    return (
      <div className="mt-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading page previews...</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Select Pages:</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <div
            key={pageNumber}
            className={`relative border rounded-lg overflow-hidden cursor-pointer transition-all duration-200 ${
              selectedPages.includes(pageNumber)
                ? "ring-2 ring-blue-500"
                : "hover:ring-2 hover:ring-gray-300"
            }`}
            onClick={() => handlePageToggle(pageNumber)}
          >
            <PagePreview
              imageUrl={pageImages[pageNumber]}
              pageNumber={pageNumber}
              isSelected={selectedPages.includes(pageNumber)}
              selectionOrder={selectionOrder.indexOf(pageNumber) + 1}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        Selected: {selectedPages.length} page
        {selectedPages.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default PageSelector;
