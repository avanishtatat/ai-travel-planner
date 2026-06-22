const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name email");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT:", error.message);
    return res
      .status(401)
      .json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
  }
};

module.exports = protect;
