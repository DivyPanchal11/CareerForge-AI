const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  getAptitudeConfig,
  getUserCredits,
  generateQuestions,
  submitAnswers,
} = require("../controllers/aptitudeController");

const router = express.Router();

/**
 * Flexible Auth Middleware:
 * If an authorization Bearer token is provided, verify it and attach req.user.
 * If token is missing, allows request to proceed as guest with IP-based tracking.
 * If token is malformed or invalid, rejects with 401.
 */
const flexibleAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User account not found.",
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized: Invalid or expired token.",
      });
    }
  }

  // No token provided - continue with guest handling
  req.user = null;
  next();
};

// Route definitions
router.get("/config", flexibleAuth, getAptitudeConfig);
router.get("/credits", flexibleAuth, getUserCredits);
router.post("/generate", flexibleAuth, generateQuestions);
router.post("/submit", flexibleAuth, submitAnswers);

module.exports = router;