# PDF Page Extractor

A web application that allows users to upload PDF files, preview pages, and extract selected pages into a new PDF document. Built with React (frontend) and Express.js (backend).

## Features

- PDF file upload with drag-and-drop support
- Page preview functionality
- Page selection interface
- Extract selected pages into a new PDF
- Support for large PDF files (up to 10MB)
- Real-time page count detection

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Tailwind CSS
- Axios for API calls
- React-dropzone for file uploads
- PDF.js for PDF rendering

### Backend
- Node.js
- Express.js
- TypeScript
- Multer for file handling
- pdf-lib for PDF manipulation
- CORS for cross-origin resource sharing

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or higher)
- npm or yarn
- Git

## Installation

### Backend Setup

1. Clone the repository and navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the backend directory:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

4. Create an uploads directory in the project root:
```bash
mkdir uploads
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Start the frontend development server:
```bash
npm run dev
```


## API Endpoints

### PDF Operations
- `POST /api/pdf/upload` - Upload a PDF file
- `GET /api/pdf/page-count/:filename` - Get the total page count of a PDF
- `POST /api/pdf/extract/:filename` - Extract selected pages from a PDF

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Drag and drop a PDF file or click to select one
3. Wait for the page previews to load
4. Select the pages you want to extract
5. Click "Extract Selected Pages" to download the new PDF


## Development

### Backend Development
- Build: `npm run build`
- Development mode: `npm run dev`

### Frontend Development
- Build: `npm run build`
- Development mode: `npm run dev`


## Acknowledgments

- PDF.js for PDF rendering
- pdf-lib for PDF manipulation
- React-dropzone for file upload functionality