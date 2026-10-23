const test = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");

const Resume = require("../models/Resume");
const resumeController = require("../controllers/resumeController");
const aiResumeController = require("../controllers/aiResumeController");
const aiResumeService = require("../services/aiResumeService");
const resumeRoutes = require("../routes/resumeRoutes");
const aiResumeRoutes = require("../routes/aiResumeRoutes");
const { getDemoDataForTemplate } = require("../utils/templateDemoData");

test("Resume Model Schema & Validation", () => {
  const dummyUser = new mongoose.Types.ObjectId();
  const resume = new Resume({
    userId: dummyUser,
    title: "Software Engineer Resume",
    template: "modern",
  });

  assert.strictEqual(resume.title, "Software Engineer Resume");
  assert.strictEqual(resume.template, "modern");
  assert.strictEqual(resume.isPublic, false);
  assert.strictEqual(resume.viewsCount, 0);
  assert.strictEqual(resume.downloadsCount, 0);
  assert.ok(Array.isArray(resume.sectionOrder));
  assert.ok(Array.isArray(resume.education));
  assert.ok(Array.isArray(resume.experience));
  assert.ok(Array.isArray(resume.skills));
});

test("Resume Controller Exports", () => {
  assert.strictEqual(typeof resumeController.createResume, "function");
  assert.strictEqual(typeof resumeController.getResumes, "function");
  assert.strictEqual(typeof resumeController.getResumeById, "function");
  assert.strictEqual(typeof resumeController.updateResume, "function");
  assert.strictEqual(typeof resumeController.deleteResume, "function");
  assert.strictEqual(typeof resumeController.duplicateResume, "function");
  assert.strictEqual(typeof resumeController.getPublicResume, "function");
  assert.strictEqual(typeof resumeController.trackPublicDownload, "function");
  assert.strictEqual(typeof resumeController.togglePublicStatus, "function");
  assert.strictEqual(typeof resumeController.getResumeAnalytics, "function");
});

test("AI Resume Controller & Service Exports", () => {
  assert.strictEqual(typeof aiResumeController.generateSummary, "function");
  assert.strictEqual(typeof aiResumeController.improveWriting, "function");
  assert.strictEqual(typeof aiResumeController.improveExperience, "function");
  assert.strictEqual(typeof aiResumeController.improveProject, "function");
  assert.strictEqual(typeof aiResumeController.checkGrammar, "function");
  assert.strictEqual(typeof aiResumeController.suggestSkills, "function");
  assert.strictEqual(typeof aiResumeController.analyzeATS, "function");
  assert.strictEqual(typeof aiResumeController.matchJobDescription, "function");
  assert.strictEqual(typeof aiResumeController.polishBulletPoint, "function");
  assert.strictEqual(typeof aiResumeController.tailorResumeForJob, "function");
  assert.strictEqual(typeof aiResumeController.forkAndTailorResume, "function");
  assert.strictEqual(typeof aiResumeController.generateInterviewPrepKit, "function");
  assert.strictEqual(typeof aiResumeController.generateCoverLetter, "function");

  assert.strictEqual(typeof aiResumeService.generateSummary, "function");
  assert.strictEqual(typeof aiResumeService.analyzeATS, "function");
});

test("AI Resume Service Heuristic Fallback Analysis", async () => {
  const sampleResume = {
    personalInfo: { fullName: "Alex Doe", email: "alex@example.com", phone: "+1234567890" },
    summary: "Senior Full Stack Engineer with 6 years experience building distributed web applications.",
    skills: [{ name: "JavaScript" }, { name: "React" }, { name: "Node.js" }, { name: "TypeScript" }, { name: "MongoDB" }],
    experience: [{ jobTitle: "Full Stack Developer", company: "Acme Corp", description: "• Built microservices" }],
    education: [{ institution: "Tech University", degree: "B.S. Computer Science" }],
    projects: [{ title: "Portfolio Platform", description: "Engineered high-performance web app" }],
  };

  const ats = await aiResumeService.analyzeATS(sampleResume);
  assert.ok(typeof ats.atsScore === "number");
  assert.ok(ats.atsScore > 50);
  assert.ok(Array.isArray(ats.strengths));
  assert.ok(Array.isArray(ats.recommendations));
});

test("Template Demo Data Support for all Templates", () => {
  const templates = [
    "modern",
    "classic",
    "minimal",
    "professional",
    "sidebar",
    "editorial",
    "atlantic",
    "cobalt",
    "mercury",
    "saffron",
  ];

  for (const t of templates) {
    const data = getDemoDataForTemplate(t);
    assert.ok(data, `Template ${t} must return demo data`);
    assert.ok(data.personalInfo?.fullName, `Template ${t} demo data must have fullName`);
  }
});
