const mongoose = require("mongoose");

const creditLedgerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["DAILY_GRANT", "WEEKLY_GRANT", "RESERVE", "COMMIT", "REFUND", "ADJUSTMENT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    idempotencyKey: {
      type: String,
      index: true,
      sparse: true,
    },
    reservationId: {
      type: String,
      index: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMMITTED", "RELEASED", "COMPLETED"],
      default: "COMPLETED",
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast idempotency lookups per user
creditLedgerSchema.index({ userId: 1, idempotencyKey: 1 });

// Index for reconciling stale pending reservations
creditLedgerSchema.index({ status: 1, expiresAt: 1 });

module.exports = mongoose.model("CreditLedger", creditLedgerSchema);
