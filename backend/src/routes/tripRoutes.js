const express = require("express");
const router = express.Router();

const {
  generateTrip,
  getTrips,
  getTripById,
  addActivity,
  removeActivity,
  regenerateDay,
  deleteTrip,
  getDashboardStats,
} = require("../controllers/tripController.js");

const protect = require("../middleware/authMiddleware.js");

const {
  generateTripValidator,
  addActivityValidator,
  removeActivityValidator,
  regenerateDayValidator,
} = require("../validators/tripValidator.js");

router.post("/generate", protect, generateTripValidator, generateTrip);
router.get("/", protect, getTrips);
router.get("/dashboard-stats", protect, getDashboardStats);
router.get("/:id", protect, getTripById);
router.patch("/:id/add-activity", protect, addActivityValidator, addActivity);
router.patch(
  "/:id/remove-activity",
  protect,
  removeActivityValidator,
  removeActivity,
);
router.patch(
  "/:id/regenerate-day",
  protect,
  regenerateDayValidator,
  regenerateDay,
);
router.delete("/:id", protect, deleteTrip);

module.exports = router;
