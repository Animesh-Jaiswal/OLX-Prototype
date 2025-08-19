const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema(
  {
    // option groups
    type: { type: String, required: true, enum: ["Flats / Apartments", "Independent / Builder Floors", "Farm House", "House & Villa"] },
    bhk: { type: String, required: true },
    bathrooms: { type: String, required: true },
    furnishing: { type: String, enum: ["Furnished", "Semi-Furnished", "Unfurnished"] },
    projectStatus: { type: String, enum: ["New Launch", "Ready to Move", "Under Construction"] },
    listedBy: { type: String, enum: ["Builder", "Dealer", "Owner"] },

    // numeric inputs
    superBuiltupSqft: { type: Number, required: true, min: 1 },
    carpetSqft: { type: Number, min: 0 },
    maintenance: { type: Number, min: 0 },
    totalFloors: { type: Number, min: 0 },
    floorNo: { type: Number, min: 0 },

    carParking: { type: String }, // "0" | "1" | "2" | "3+"
    facing: { type: String },
    projectName: { type: String, trim: true, maxlength: 70 },

    // ad content
    title: { type: String, required: true, trim: true, maxlength: 70 },
    description: { type: String, required: true, trim: true, maxlength: 4096 },
    price: { type: Number, required: true, min: 1 },

    // photos: array of Cloudinary secure URLs
    images: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1 && arr.length <= 20,
        message: "1-20 images required"
      }
    },

    // location & contact
    state: { type: String, required: true },
    name: { type: String, required: true, maxlength: 30, trim: true },
    phone: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ad", AdSchema);
