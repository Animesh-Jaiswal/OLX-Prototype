const multer = require("multer");

// keep files in memory for streaming to Cloudinary
const storage = multer.memoryStorage();

// file size limit ~5MB per image; max 20 images in route
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});

module.exports = upload;
