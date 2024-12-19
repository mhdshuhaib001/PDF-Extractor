import { useState } from "react";
import FileUpload from "./components/FileUpload";
import PageSelector from "./components/PageSelector";
import CreatePDF from "./components/CreatePdf";

function App() {
  const [filename, setFilename] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFileUpload = (uploadedFilename: string) => {
    setFilename(uploadedFilename);
    setSelectedPages([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center">
      <div className="container mx-auto px-4">
        <div className="relative py-3 max-w-4xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative bg-white shadow-lg sm:rounded-3xl p-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-semibold mb-6 text-center">
                PDF Page Extractor
              </h1>
              <FileUpload
                onFileUpload={handleFileUpload}
                setTotalPages={setTotalPages}
              />
              {filename && totalPages > 0 && (
                <PageSelector
                  totalPages={totalPages}
                  selectedPages={selectedPages}
                  onPageSelection={setSelectedPages}
                  filename={filename}
                />
              )}
              <CreatePDF 
                filename={filename} 
                selectedPages={selectedPages} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;