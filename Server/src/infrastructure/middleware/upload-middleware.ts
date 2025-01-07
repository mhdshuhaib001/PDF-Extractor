import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

console.log('Cloudinary config:', {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  hasSecret: !!process.env.CLOUDINARY_API_SECRET,
  hasKey: !!process.env.CLOUDINARY_API_KEY
});

cloudinary.config({
  cloud_name: "dnk12xdah",
  api_key: "428451257654476",
  api_secret: "WNgUNihw3EJ2DJjh3mect8AfEJs"
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdfs",
    resource_type: "raw",
    allowed_formats: ["pdf"]
  } as any
});

// Create multer upload middleware
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDFs are allowed."));
    }
  }
});
