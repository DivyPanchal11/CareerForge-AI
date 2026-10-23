const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Resume title is required"],
      trim: true,
      default: "Untitled Resume",
    },
    template: {
      type: String,
      default: "modern",
    },
    personalInfo: {
      fullName: { type: String, default: "" },
      jobTitle: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      photo: { type: String, default: "" },
    },
    summary: {
      type: String,
      default: "",
    },
    education: [
      {
        id: { type: String, required: true },
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        grade: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    experience: [
      {
        id: { type: String, required: true },
        jobTitle: { type: String, default: "" },
        company: { type: String, default: "" },
        location: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        currentlyWorking: { type: Boolean, default: false },
        description: { type: String, default: "" },
      },
    ],
    skills: [
      {
        id: { type: String, required: true },
        name: { type: String, default: "" },
        category: { type: String, default: "Technical" }, // Technical, Soft Skills, Frameworks, Tools
        level: { type: String, default: "Intermediate" },
      },
    ],
    projects: [
      {
        id: { type: String, required: true },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: { type: String, default: "" },
        projectLink: { type: String, default: "" },
        githubLink: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
      },
    ],
    certifications: [
      {
        id: { type: String, required: true },
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        issueDate: { type: String, default: "" },
        expiryDate: { type: String, default: "" },
        credentialId: { type: String, default: "" },
        credentialUrl: { type: String, default: "" },
      },
    ],
    languages: [
      {
        id: { type: String, required: true },
        language: { type: String, default: "" },
        proficiency: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"],
          default: "Intermediate",
        },
      },
    ],
    interests: [
      {
        type: String,
      },
    ],
    customSections: [
      {
        id: { type: String, required: true },
        title: { type: String, default: "Custom Section" },
        items: [
          {
            id: { type: String, required: true },
            title: { type: String, default: "" },
            subtitle: { type: String, default: "" },
            date: { type: String, default: "" },
            description: { type: String, default: "" },
            link: { type: String, default: "" },
          },
        ],
      },
    ],
    sectionOrder: [
      {
        type: String,
      },
    ],
    hiddenSections: [
      {
        type: String,
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
    theme: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    photoSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    lastViewedAt: {
      type: Date,
      default: null,
    },
    pageCountLock: {
      type: Number,
      default: null, // null (auto/fluid), 1, or 2
    },
    versions: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        resumeData: { type: mongoose.Schema.Types.Mixed, required: true },
      },
    ],
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
