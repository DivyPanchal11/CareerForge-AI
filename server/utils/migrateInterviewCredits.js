/**
 * Database Migration & Readiness Verification for Interview Credits
 *
 * Verifies and ensures:
 * 1. Indexes on CreditAccount (userId unique, lastResetPeriodStart)
 * 2. Indexes on CreditLedger (userId, reservationId, idempotencyKey, status, expiresAt)
 * 3. Ensures every existing User has a CreditAccount initialized with dailyAllowance
 * 4. Reconciles any stale reservations
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const CreditAccount = require("../models/CreditAccount");
const CreditLedger = require("../models/CreditLedger");
const { getDailyResetWindow, DEFAULT_DAILY_ALLOWANCE } = require("../config/creditConfig");
const { reconcileAllStaleReservations } = require("../services/creditService");

async function runMigration() {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/careerforge";
  console.log(`[Migration] Connecting to MongoDB: ${mongoUri.replace(/:[^:@]+@/, ":****@")}`);

  await mongoose.connect(mongoUri);

  try {
    console.log("[Migration] 1. Creating/Verifying indexes...");
    await CreditAccount.init();
    await CreditLedger.init();
    console.log("[Migration] Indexes verified on CreditAccount and CreditLedger.");

    console.log("[Migration] 2. Checking user accounts initialization...");
    const users = await User.find({}).select("_id email").lean();
    console.log(`[Migration] Found ${users.length} registered users.`);

    const { periodStart, nextReset } = getDailyResetWindow();
    let createdCount = 0;

    for (const u of users) {
      const existing = await CreditAccount.findOne({ userId: u._id });
      if (!existing) {
        await CreditAccount.create({
          userId: u._id,
          balance: DEFAULT_DAILY_ALLOWANCE,
          reservedBalance: 0,
          dailyAllowance: DEFAULT_DAILY_ALLOWANCE,
          weeklyAllowance: DEFAULT_DAILY_ALLOWANCE,
          lastResetPeriodStart: periodStart,
        });

        await CreditLedger.create({
          userId: u._id,
          type: "DAILY_GRANT",
          amount: DEFAULT_DAILY_ALLOWANCE,
          balanceAfter: DEFAULT_DAILY_ALLOWANCE,
          status: "COMPLETED",
          description: "Initial daily application credit grant on migration",
          metadata: { periodStart, nextReset, initialGrant: true },
        });

        createdCount++;
      }
    }
    console.log(`[Migration] Initialized ${createdCount} new CreditAccounts.`);

    console.log("[Migration] 3. Reconciling stale reservations...");
    await reconcileAllStaleReservations();

    console.log("[Migration] Credit system migration & verification complete.");
  } finally {
    await mongoose.disconnect();
    console.log("[Migration] Disconnected from MongoDB.");
  }
}

if (require.main === module) {
  runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Migration Error]:", err);
      process.exit(1);
    });
}

module.exports = runMigration;
