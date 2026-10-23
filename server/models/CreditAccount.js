const mongoose = require("mongoose");
const { DEFAULT_DAILY_ALLOWANCE } = require("../config/creditConfig");

const creditAccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    balance: {
      type: Number,
      required: true,
      default: DEFAULT_DAILY_ALLOWANCE,
      min: 0,
    },
    reservedBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    dailyAllowance: {
      type: Number,
      default: DEFAULT_DAILY_ALLOWANCE,
      min: 0,
    },
    weeklyAllowance: {
      type: Number,
      default: DEFAULT_DAILY_ALLOWANCE,
      min: 0,
    },
    lastResetPeriodStart: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CreditAccount", creditAccountSchema);
