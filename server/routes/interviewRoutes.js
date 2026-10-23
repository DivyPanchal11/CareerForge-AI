const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  getInterviewConfig,
  getUserCredits,
  generateQuestions,
  evaluateAnswer,
  summarizeSession,
} = require("../controllers/interviewController");

const router = express.Router();

/**
 * Flexible Auth Middleware:
 * If an authorization Bearer token is provided, verify it and attach req.user.
 * If token is missing, allows request to proceed.
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
      return next();
    } catch (error) {
      // Allow proceeding if token is expired/invalid for public interview demo
      req.user = null;
      return next();
    }
  }

  req.user = null;
  next();
};

router.get("/config", flexibleAuth, getInterviewConfig);
router.get("/credits", flexibleAuth, getUserCredits);
router.post("/generate-questions", flexibleAuth, generateQuestions);
router.post("/evaluate-answer", flexibleAuth, evaluateAnswer);
router.post("/summarize-session", flexibleAuth, summarizeSession);

module.exports = router;
