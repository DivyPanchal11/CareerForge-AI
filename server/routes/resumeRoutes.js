const express = require("express");
const router = express.Router();
const {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
  getPublicResume,
  trackPublicDownload,
  togglePublicStatus,
  getResumeAnalytics,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");

// ── Public Routes (No authentication required) ──
router.get("/public/:id", getPublicResume);
router.post("/public/:id/track-download", trackPublicDownload);

// ── Protected Routes (Require JWT login) ──
router.use(protect);

router.post("/", createResume);
router.get("/", getResumes);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);
router.post("/:id/duplicate", duplicateResume);
router.put("/:id/share", togglePublicStatus);
router.get("/:id/analytics", getResumeAnalytics);

module.exports = router;
