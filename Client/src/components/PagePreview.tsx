interface PagePreviewProps {
    imageUrl: string;
    pageNumber: number;
    isSelected: boolean;
  }
  
  const PagePreview: React.FC<PagePreviewProps> = ({ imageUrl, pageNumber, isSelected }) => {
    return (
      <div className="relative group">
        <div className="aspect-[3/4] w-full">
          <img
            src={imageUrl}
            alt={`Page ${pageNumber}`}
            className="w-full h-full object-contain bg-white"
          />
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            isSelected ? 'bg-blue-500/20' : 'bg-black/0 group-hover:bg-black/5'
          }`}
        >
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              isSelected
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100/90 text-gray-700'
            }`}
          >
            Page {pageNumber}
          </span>
        </div>
      </div>
    );
  };
  
  export default PagePreview;
  