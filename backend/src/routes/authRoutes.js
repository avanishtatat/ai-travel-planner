const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  profile,
} = require("../controllers/authController.js");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator.js");
const protect = require("../middleware/authMiddleware.js");

router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);
router.get("/me", protect, profile);

module.exports = router;
