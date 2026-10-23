const Resume = require("../models/Resume");
const { analyzeATS } = require("../services/aiResumeService");
const { getDemoDataForTemplate } = require("../utils/templateDemoData");

// Default initial resume structure
const defaultResumeData = {
  title: "Untitled Resume",
  template: "modern",
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    photo: "",
  },
  summary: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: [
    "personalInfo",
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "certifications",
    "languages",
    "interests",
  ],
  hiddenSections: [],
  atsScore: 0,
};

// 1. Create Resume
const createResume = async (req, res) => {
  try {
    const data = req.body || {};
    const newResume = new Resume({
      ...defaultResumeData,
      ...data,
      userId: req.user.id,
      // Ensure required fields have sensible defaults
      title: data.title || "My Resume",
      template: data.template || "modern",
    });

    // Recalculate ATS score based on the full payload
    const atsResult = await analyzeATS(newResume);
    newResume.atsScore = atsResult.atsScore;

    await newResume.save();

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume: newResume,
    });
  } catch (error) {
    console.error("Create Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create resume",
    });
  }
};

// 2. Get All Resumes for Logged-In User
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get Resumes Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes",
    });
  }
};

// 3. Get Single Resume by ID
const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Resume By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume details",
    });
  }
};

// 4. Update Resume
const updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    const updateFields = req.body;

    // Recalculate ATS score on update
    const tempResumeObj = { ...resume.toObject(), ...updateFields };
    const atsResult = await analyzeATS(tempResumeObj);
    updateFields.atsScore = atsResult.atsScore;

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error("Update Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update resume",
    });
  }
};

// 5. Delete Resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    console.error("Delete Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete resume",
    });
  }
};

// 6. Duplicate Resume
const duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!original) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    const obj = original.toObject();
    delete obj._id;
    delete obj.createdAt;
    delete obj.updatedAt;

    obj.title = `${original.title} (Copy)`;

    const copyResume = new Resume(obj);
    await copyResume.save();

    res.status(201).json({
      success: true,
      message: "Resume duplicated successfully",
      resume: copyResume,
    });
  } catch (error) {
    console.error("Duplicate Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to duplicate resume",
    });
  }
};

// 7. Get Public Resume (No Auth Required)
const getPublicResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (!resume.isPublic) {
      return res.status(403).json({
        success: false,
        message: "This resume is private. The public link has been disabled by the author.",
      });
    }

    // Atomically increment views count and update lastViewedAt
    resume.viewsCount = (resume.viewsCount || 0) + 1;
    resume.lastViewedAt = new Date();
    await resume.save();

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Get Public Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load public resume",
    });
  }
};

// 8. Track Public Download (Increment Download Counter)
const trackPublicDownload = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    resume.downloadsCount = (resume.downloadsCount || 0) + 1;
    await resume.save();

    res.status(200).json({
      success: true,
      downloadsCount: resume.downloadsCount,
    });
  } catch (error) {
    console.error("Track Download Error:", error);
    res.status(500).json({ success: false, message: "Failed to track download" });
  }
};

// 9. Toggle Public Sharing Status (Protected)
const togglePublicStatus = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized access",
      });
    }

    const { isPublic } = req.body;
    resume.isPublic = typeof isPublic === "boolean" ? isPublic : !resume.isPublic;
    await resume.save();

    res.status(200).json({
      success: true,
      message: resume.isPublic ? "Public link activated" : "Public link disabled",
      isPublic: resume.isPublic,
      viewsCount: resume.viewsCount || 0,
      downloadsCount: resume.downloadsCount || 0,
      lastViewedAt: resume.lastViewedAt,
    });
  } catch (error) {
    console.error("Toggle Public Status Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle public status",
    });
  }
};

// 10. Get Resume Analytics (Protected)
const getResumeAnalytics = async (req, res) => {
  try {
    const resume = await Resume.findOne(
      { _id: req.params.id, userId: req.user.id },
      "isPublic viewsCount downloadsCount lastViewedAt title"
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      analytics: {
        isPublic: resume.isPublic || false,
        viewsCount: resume.viewsCount || 0,
        downloadsCount: resume.downloadsCount || 0,
        lastViewedAt: resume.lastViewedAt,
        title: resume.title,
      },
    });
  } catch (error) {
    console.error("Get Resume Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
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
};
