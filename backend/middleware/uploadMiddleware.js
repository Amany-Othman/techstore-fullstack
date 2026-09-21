import multer from "multer";
import path from "node:path";
import fs from "node:fs";

/*
  Storage strategy:
  - If CLOUDINARY_CLOUD_NAME is set in .env  -> upload to Cloudinary (images survive redeploys)
  - Otherwise                                -> save to backend/uploads/ on disk (fine for local dev)

  So you can build locally with disk storage and flip to Cloudinary later
  just by adding the three env vars. No code change needed.
*/

const useCloudinary = Boolean(process.env.CLOUDINARY_CLOUD_NAME);

let storage;

if (useCloudinary) {
  const { v2: cloudinary } = await import("cloudinary");
  const { CloudinaryStorage } = await import("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "techstore",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  const uploadDir = path.resolve("uploads");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),

    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${ext}`);
    },
  });
}

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpeg|jpg|png|webp|gif)$/.test(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("Only image files are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Returns the URL to store in product.image (or null if no file was sent)
export const getUploadedImageUrl = (req) => {
  if (!req.file) return null;

  // Cloudinary puts the full https URL on file.path
  if (useCloudinary) return req.file.path;

  const base =
    process.env.SERVER_URL || `${req.protocol}://${req.get("host")}`;

  return `${base}/uploads/${req.file.filename}`;
};
