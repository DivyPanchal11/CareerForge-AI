/**
 * Idempotent Batch Daily Credit Reset Job
 *
 * Resets all user credit accounts whose lastResetPeriodStart is older
 * than the current day's 00:00:00 UTC boundary.
 *
 * Can be run manually, via cron, or external task scheduler.
 * (Note: Lazy resets on user access already handle active users automatically).
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const CreditAccount = require("../models/CreditAccount");
const CreditLedger = require("../models/CreditLedger");
const { getDailyResetWindow, DEFAULT_DAILY_ALLOWANCE } = require("../config/creditConfig");

async function runDailyCreditReset() {
  const { periodStart, nextReset } = getDailyResetWindow();
  console.log(`[CreditResetJob] Resetting daily allowances to 00:00 UTC boundary: ${periodStart.toISOString()}`);

  const staleAccounts = await CreditAccount.find({
    lastResetPeriodStart: { $lt: periodStart },
  });

  console.log(`[CreditResetJob] Found ${staleAccounts.length} accounts requiring daily reset.`);

  let resetCount = 0;
  for (const account of staleAccounts) {
    const allowance =
      account.dailyAllowance || account.weeklyAllowance || DEFAULT_DAILY_ALLOWANCE;

    await CreditAccount.updateOne(
      { _id: account._id },
      {
        $set: {
          balance: allowance,
          reservedBalance: 0,
          lastResetPeriodStart: periodStart,
        },
      }
    );

    await CreditLedger.create({
      userId: account.userId,
      type: "DAILY_GRANT",
      amount: allowance,
      balanceAfter: allowance,
      status: "COMPLETED",
      description: "Batch daily credit allowance reset (00:00 UTC)",
      metadata: {
        periodStart,
        nextReset,
        resetByJob: true,
      },
    });

    resetCount++;
  }

  // Also clean up any expired pending reservations across all accounts
  const now = new Date();
  const expiredReservations = await CreditLedger.find({
    status: "PENDING",
    expiresAt: { $lt: now },
  });

  console.log(`[CreditResetJob] Found ${expiredReservations.length} expired reservations to reconcile.`);

  let refundCount = 0;
  for (const res of expiredReservations) {
    const cost = Math.abs(res.amount);
    const updated = await CreditAccount.findOneAndUpdate(
      { userId: res.userId },
      {
        $inc: { balance: cost, reservedBalance: -cost },
      },
      { new: true }
    );

    res.status = "RELEASED";
    await res.save();

    await CreditLedger.create({
      userId: res.userId,
      type: "REFUND",
      amount: cost,
      balanceAfter: updated ? updated.balance : 0,
      reservationId: res.reservationId,
      status: "COMPLETED",
      description: `Batch job recovery: refunded ${cost} expired reserved credits`,
      metadata: { originalReservationId: res.reservationId },
    });

    refundCount++;
  }

  console.log(`[CreditResetJob] Successfully reset ${resetCount} accounts and reconciled ${refundCount} expired reservations.`);
  return { resetCount, refundCount };
}

// If invoked directly from command line
if (require.main === module) {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("[CreditResetJob] MONGO_URI is missing in environment.");
    process.exit(1);
  }

  mongoose
    .connect(mongoUri)
    .then(async () => {
      console.log("[CreditResetJob] Connected to MongoDB.");
      await runDailyCreditReset();
      await mongoose.disconnect();
      console.log("[CreditResetJob] Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("[CreditResetJob] Error:", err.message);
      process.exit(1);
    });
}

module.exports = { runDailyCreditReset, runWeeklyCreditReset: runDailyCreditReset };
