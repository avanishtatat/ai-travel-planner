const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

const generateTripValidator = [
  body("destination").trim().notEmpty().withMessage("Destination is required"),

  body("numberOfDays")
    .isInt({ min: 1, max: 30 })
    .withMessage("Number of days must be an integer between 1 and 30"),

  body("budgetType")
    .trim()
    .notEmpty()
    .withMessage("Budget type is required")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Budget type must be one of: Low, Medium, High"),

  body("interests")
    .isArray({ min: 1 })
    .withMessage("Select at least one interest"),

  body("startDate").isISO8601().withMessage("Start date must be a valid date"),

  body("travelersCount")
    .isInt({ min: 1 })
    .withMessage("Travelers count must be at least 1"),

  body("travelStyle")
    .trim()
    .notEmpty()
    .withMessage("Travel style is required")
    .isIn(["Relaxed", "Balanced", "Packed"])
    .withMessage("Travel style must be one of: Relaxed, Balanced, Packed"),

  handleValidationErrors,
];

const addActivityValidator = [
  body("dayNumber").isInt({ min: 1 }).withMessage("Invalid day number"),

  body("activity.title")
    .trim()
    .notEmpty()
    .withMessage("Activity title is required"),

  body("activity.description")
    .trim()
    .notEmpty()
    .withMessage("Activity description is required"),

  body("activity.time")
    .trim()
    .notEmpty()
    .withMessage("Activity time is required"),

  body("activity.estimatedCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated cost must be a positive number"),

  handleValidationErrors,
];

const removeActivityValidator = [
  body("dayNumber").isInt({ min: 1 }).withMessage("Invalid day number"),

  body("activityId").isMongoId().withMessage("Invalid activity ID"),

  handleValidationErrors,
];

const regenerateDayValidator = [
  body("dayNumber").isInt({ min: 1 }).withMessage("Invalid day number"),

  body("instruction")
    .trim()
    .notEmpty()
    .withMessage("Instruction is required")
    .isLength({ min: 10 })
    .withMessage("Instruction must be at least 10 characters long"),

  handleValidationErrors,
];

module.exports = {
  generateTripValidator,
  addActivityValidator,
  removeActivityValidator,
  regenerateDayValidator,
};
