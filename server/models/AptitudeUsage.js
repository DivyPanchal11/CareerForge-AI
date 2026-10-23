const mongoose = require("mongoose");

const aptitudeUsageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    count: {
      type: Number,
      default: 0,
    },
    lastRequestAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB TTL index to auto-expire documents at expiresAt
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AptitudeUsage", aptitudeUsageSchema);
