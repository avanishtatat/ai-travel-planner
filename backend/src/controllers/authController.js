const User = require("../models/User.js");
const asyncHandler = require("../utils/asyncHandler.js");
const generateToken = require("../utils/generateToken.js");

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res
      .status(409)
      .json({ success: false, message: "Email already in use" });
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  const token = generateToken(newUser._id);
  return res
    .status(201)
    .json({
      success: true,
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = generateToken(user._id);
  return res
    .status(200)
    .json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
});

const profile = asyncHandler(async (req, res, next) => {
  const user = req.user;
  return res
    .status(200)
    .json({ success: true, user: { id: user._id, name: user.name, email: user.email } });
});

module.exports = { registerUser, loginUser, profile };
