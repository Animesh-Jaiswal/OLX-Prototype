const { body } = require("express-validator");

const requiredString = (f, label = f) =>
  body(f).isString().trim().notEmpty().withMessage(`${label} is required`);

exports.createAdRules = [
  requiredString("type", "Type"),
  requiredString("bhk", "BHK"),
  requiredString("bathrooms", "Bathrooms"),
  body("superBuiltupSqft").isFloat({ gt: 0 }).withMessage("Super Builtup area is required"),
  requiredString("title", "Title").isLength({ max: 70 }).withMessage("Title max 70 chars"),
  requiredString("description", "Description").isLength({ max: 4096 }).withMessage("Description max 4096 chars"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be > 0"),
  requiredString("state", "State"),
  requiredString("name", "Name").isLength({ max: 30 }).withMessage("Name max 30"),
  requiredString("phone", "Phone").matches(/^[0-9]{10}$/).withMessage("Phone must be 10 digits"),

  // optional numeric validations
  body("carpetSqft").optional().isFloat({ min: 0 }),
  body("maintenance").optional().isFloat({ min: 0 }),
  body("totalFloors").optional().isInt({ min: 0 }),
  body("floorNo").optional().isInt({ min: 0 })
];
