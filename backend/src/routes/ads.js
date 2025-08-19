const express = require("express");
const { validationResult } = require("express-validator");
const Ad = require("../models/Ad");
const upload = require("../multer");
const { createAdRules } = require("../validators/adValidator");
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");

const router = express.Router();

/**
 * POST /api/ads
 * multipart/form-data
 *  - images: File[] (max 20)
 *  - other text fields from your React form
 */
router.post("/", upload.array("images", 20), createAdRules, async (req, res) => {
  try {
    // 1) validate text fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // 2) must have at least 1 image
    if (!req.files || req.files.length < 1) {
      return res.status(400).json({ errors: [{ msg: "At least 1 photo required", param: "images" }] });
    }

    // 3) upload all images to Cloudinary
    const uploads = req.files.map((file) => uploadBufferToCloudinary(file.buffer, "olx-prototype"));
    const results = await Promise.all(uploads);
    const imageURLs = results.map((r) => r.secure_url);

    // 4) create ad in DB
    const ad = await Ad.create({
      ...req.body,
      // cast numeric fields (since multipart sends strings)
      superBuiltupSqft: Number(req.body.superBuiltupSqft),
      carpetSqft: req.body.carpetSqft ? Number(req.body.carpetSqft) : undefined,
      maintenance: req.body.maintenance ? Number(req.body.maintenance) : undefined,
      totalFloors: req.body.totalFloors ? Number(req.body.totalFloors) : undefined,
      floorNo: req.body.floorNo ? Number(req.body.floorNo) : undefined,
      price: Number(req.body.price),
      images: imageURLs
    });

    return res.status(201).json(ad);
  } catch (err) {
    console.error("Create ad error:", err);
    return res.status(500).json({ error: "Server error uploading ad" });
  }
});

/**
 * GET /api/ads?skip=0&limit=20
 * list ads (newest first) with simple pagination
 */
router.get("/", async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const skip = Number(req.query.skip) || 0;
  const ads = await Ad.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
  res.json(ads);
});

/** GET /api/ads/:id */
router.get("/:id", async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  if (!ad) return res.status(404).json({ error: "Not found" });
  res.json(ad);
});

/** PUT /api/ads/:id (optional: no image update in this simple demo) */
router.put("/:id", upload.array("images", 20), async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    // If new images uploaded → upload to Cloudinary
    let uploadedImages = ad.images;
    if (req.files && req.files.length > 0) {
      const newUrls = [];
      for (const file of req.files) {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "olx-prototype" },
          (error, result) => {
            if (error) throw error;
            newUrls.push(result.secure_url);
          }
        );
        stream.end(file.buffer);
      }

      // wait until uploads done
      await new Promise((resolve) => setTimeout(resolve, 1000));
      uploadedImages = [...uploadedImages, ...newUrls];
    }

    const updated = await Ad.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: uploadedImages },
      { new: true }
    );

    res.json({ message: "Ad updated", ad: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});


/** DELETE /api/ads/:id */
router.delete("/:id", async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });
    res.json({ message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
