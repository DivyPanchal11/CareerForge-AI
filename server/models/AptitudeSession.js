const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: {
      type: [optionSchema],
      validate: [
        (val) => val.length === 4,
        "Each question must have exactly 4 options.",
      ],
      required: true,
    },
    correctOptionId: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const aptitudeSessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    modelUsed: {
      type: String,
      required: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    submittedAnswers: {
      type: Map,
      of: String,
      default: {},
    },
    score: {
      type: Number,
      default: 0,
    },
    accuracy: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timeSpentSeconds: {
      type: Number,
      default: 0,
    },
    isSubmitted: {
      type: Boolean,
      default: false,
      index: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically remove old unsubmitted / test sessions after 14 days
aptitudeSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 14 * 24 * 60 * 60 });

module.exports = mongoose.model("AptitudeSession", aptitudeSessionSchema);
