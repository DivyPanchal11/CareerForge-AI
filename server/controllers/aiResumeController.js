const aiResumeService = require("../services/aiResumeService");
const Resume = require("../models/Resume");

// 1. Generate Summary
const generateSummary = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const summary = await aiResumeService.generateSummary(resumeData || {});
    res.status(200).json({ success: true, result: summary });
  } catch (error) {
    console.error("AI Generate Summary Error:", error);
    res.status(500).json({ success: false, message: "AI generation failed" });
  }
};

// 2. Improve Writing
const improveWriting = async (req, res) => {
  try {
    const { text, context } = req.body;
    const result = await aiResumeService.improveWriting(text, context);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Improve Writing Error:", error);
    res.status(500).json({ success: false, message: "AI rephrase failed" });
  }
};

// 3. Improve Experience
const improveExperience = async (req, res) => {
  try {
    const { description } = req.body;
    const result = await aiResumeService.improveExperience(description);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Improve Experience Error:", error);
    res.status(500).json({ success: false, message: "AI experience polish failed" });
  }
};

// 4. Improve Project
const improveProject = async (req, res) => {
  try {
    const { description } = req.body;
    const result = await aiResumeService.improveProject(description);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Improve Project Error:", error);
    res.status(500).json({ success: false, message: "AI project polish failed" });
  }
};

// 5. Check Grammar
const checkGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    const result = await aiResumeService.checkGrammar(text);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Check Grammar Error:", error);
    res.status(500).json({ success: false, message: "Grammar check failed" });
  }
};

// 6. Skill Suggestions
const suggestSkills = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const suggestions = await aiResumeService.suggestSkills(resumeData || {});
    res.status(200).json({ success: true, suggestions });
  } catch (error) {
    console.error("AI Suggest Skills Error:", error);
    res.status(500).json({ success: false, message: "Skill suggestion failed" });
  }
};

// 7. Analyze ATS
const analyzeATS = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const analysis = await aiResumeService.analyzeATS(resumeData || {});
    res.status(200).json({ success: true, ...analysis });
  } catch (error) {
    console.error("AI Analyze ATS Error:", error);
    res.status(500).json({ success: false, message: "ATS analysis failed" });
  }
};

// 8. Match Job Description
const matchJobDescription = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    const result = await aiResumeService.matchJobDescription(resumeData || {}, jobDescription);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Match Job Error:", error);
    res.status(500).json({ success: false, message: "Job description matching failed" });
  }
};

// 9. Polish Single Bullet Point
const polishBulletPoint = async (req, res) => {
  try {
    const { bullet, mode } = req.body;
    const result = await aiResumeService.polishBulletPoint(bullet, mode);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("AI Polish Bullet Error:", error);
    res.status(500).json({ success: false, message: "Bullet point polish failed" });
  }
};

// 10. Tailor Resume for Job Description
const tailorResumeForJob = async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName, jobUrl } = req.body;
    const result = await aiResumeService.tailorResumeForJob({
      resumeData: resumeData || {},
      jobDescription,
      companyName,
      jobUrl,
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Tailor Resume Error:", error);
    res.status(500).json({ success: false, message: "Failed to tailor resume for job" });
  }
};

// 11. Fork & Tailor Resume (1-Click Duplicate & Keyword Pre-populate)
const forkAndTailorResume = async (req, res) => {
  try {
    const { resumeId, jobDescription, companyName, jobUrl } = req.body;
    const original = await Resume.findOne({
      _id: resumeId,
      userId: req.user.id,
    });

    if (!original) {
      return res.status(404).json({
        success: false,
        message: "Original resume not found or unauthorized",
      });
    }

    const tailorResult = await aiResumeService.tailorResumeForJob({
      resumeData: original.toObject(),
      jobDescription,
      companyName,
      jobUrl,
    });

    const obj = original.toObject();
    delete obj._id;
    delete obj.createdAt;
    delete obj.updatedAt;

    const company = tailorResult.companyName || "Target Company";
    obj.title = `Tailored for ${company}`;
    obj.summary = tailorResult.tailoredSummary || obj.summary;

    if (tailorResult.tailoredExperience && tailorResult.tailoredExperience.length > 0) {
      obj.experience = tailorResult.tailoredExperience;
    }

    if (tailorResult.forkedResumeData?.skills) {
      obj.skills = tailorResult.forkedResumeData.skills;
    }

    obj.versions = [
      {
        id: `ver-${Date.now()}`,
        name: `Auto-Tailored for ${company}`,
        createdAt: new Date(),
        resumeData: { ...obj },
      },
    ];

    const forkedResume = new Resume(obj);
    await forkedResume.save();

    res.status(201).json({
      success: true,
      message: `Resume successfully duplicated and tailored for ${company}`,
      forkedResume,
      ...tailorResult,
    });
  } catch (error) {
    console.error("Fork & Tailor Resume Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fork and tailor resume",
    });
  }
};

// 12. Generate AI Interview Prep Kit
const generateInterviewPrepKit = async (req, res) => {
  try {
    const { resumeData } = req.body;
    const result = await aiResumeService.generateInterviewPrepKit(resumeData || {});
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Interview Prep Kit Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate interview prep kit",
    });
  }
};

// 13. Generate AI Cover Letter
const generateCoverLetter = async (req, res) => {
  try {
    const { resumeData, jobDescription, companyName, tone } = req.body;
    const result = await aiResumeService.generateCoverLetter({
      resumeData: resumeData || {},
      jobDescription: jobDescription || "",
      companyName: companyName || "",
      tone: tone || "confident",
    });
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("AI Cover Letter Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate cover letter",
    });
  }
};

module.exports = {
  generateSummary,
  improveWriting,
  improveExperience,
  improveProject,
  checkGrammar,
  suggestSkills,
  analyzeATS,
  matchJobDescription,
  polishBulletPoint,
  tailorResumeForJob,
  forkAndTailorResume,
  generateInterviewPrepKit,
  generateCoverLetter,
};
