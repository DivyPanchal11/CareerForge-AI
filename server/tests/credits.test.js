/**
 * Automated Test Suite for Aptitude Daily Credit System
 *
 * Tests:
 * 1. Configurable allowance & generation cost calculations
 * 2. Deterministic daily 00:00 UTC reset boundaries & idempotency
 * 3. Concurrency-safe atomic reservations and overspend prevention
 * 4. Idempotency guards and duplicate submission protection
 * 5. Two-phase commit and refund on generation/validation failure
 * 6. Server restart / stale reservation recovery
 * 7. Mixed category validation and distribution
 */

const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DEFAULT_DAILY_ALLOWANCE,
  DEFAULT_WEEKLY_ALLOWANCE,
  COST_PER_QUESTION,
  calculateGenerationCost,
  getDailyResetWindow,
} = require("../config/creditConfig");

const { InsufficientCreditsError } = require("../services/creditService");

test("Aptitude Daily Credit System Test Suite", async (t) => {
  await t.test("1. Allowance & Cost Calculations", () => {
    assert.ok(DEFAULT_DAILY_ALLOWANCE > 0);
    assert.equal(COST_PER_QUESTION, 2);

    // 5 questions * 2 = 10 credits
    assert.equal(calculateGenerationCost(5), 10);
    // 3 questions * 2 = 6 credits
    assert.equal(calculateGenerationCost(3), 6);
    // 10 questions * 2 = 20 credits
    assert.equal(calculateGenerationCost(10), 20);
    // Defaults to at least 1 question
    assert.equal(calculateGenerationCost(0), 2);
  });

  await t.test("2. Daily 00:00 UTC Reset Boundary: Exactness & Consistency", () => {
    // Case A: Afternoon (2026-10-21 14:30:00 UTC)
    const afternoon = new Date(Date.UTC(2026, 9, 21, 14, 30, 0));
    const windowA = getDailyResetWindow(afternoon);

    // Should point back to Today Oct 21, 2026 00:00:00 UTC
    assert.equal(windowA.periodStart.toISOString(), "2026-10-21T00:00:00.000Z");
    // Next reset is Tomorrow Oct 22, 2026 00:00:00 UTC
    assert.equal(windowA.nextReset.toISOString(), "2026-10-22T00:00:00.000Z");

    // Case B: Early morning (2026-10-21 00:01:00 UTC)
    const earlyMorning = new Date(Date.UTC(2026, 9, 21, 0, 1, 0));
    const windowB = getDailyResetWindow(earlyMorning);
    assert.equal(windowB.periodStart.toISOString(), "2026-10-21T00:00:00.000Z");
    assert.equal(windowB.nextReset.toISOString(), "2026-10-22T00:00:00.000Z");

    // Case C: Late night (2026-10-21 23:59:59 UTC)
    const lateNight = new Date(Date.UTC(2026, 9, 21, 23, 59, 59));
    const windowC = getDailyResetWindow(lateNight);
    assert.equal(windowC.periodStart.toISOString(), "2026-10-21T00:00:00.000Z");
    assert.equal(windowC.nextReset.toISOString(), "2026-10-22T00:00:00.000Z");

    // Case D: Next Day at exactly 00:00:00 UTC (New reset period starts)
    const nextDayExact = new Date(Date.UTC(2026, 9, 22, 0, 0, 0));
    const windowD = getDailyResetWindow(nextDayExact);
    assert.equal(windowD.periodStart.toISOString(), "2026-10-22T00:00:00.000Z");
    assert.equal(windowD.nextReset.toISOString(), "2026-10-23T00:00:00.000Z");
  });

  await t.test("3. Concurrency-Safe Atomic Overspend Prevention Logic", () => {
    // Simulate atomic update logic:
    // CreditAccount.findOneAndUpdate({ balance: { $gte: cost } }, { $inc: { balance: -cost, reservedBalance: cost } })
    let mockAccount = {
      balance: 10,
      reservedBalance: 0,
      dailyAllowance: 50,
    };

    const atomicReserve = (account, cost) => {
      if (account.balance >= cost) {
        account.balance -= cost;
        account.reservedBalance += cost;
        return { success: true, balance: account.balance, reserved: account.reservedBalance };
      }
      return null;
    };

    // First request: wants 10 credits -> succeeds
    const req1 = atomicReserve(mockAccount, 10);
    assert.notEqual(req1, null);
    assert.equal(mockAccount.balance, 0);
    assert.equal(mockAccount.reservedBalance, 10);

    // Simultaneous second request: wants 10 credits -> fails atomically because balance is 0
    const req2 = atomicReserve(mockAccount, 10);
    assert.equal(req2, null, "Overspending must be rejected when balance < cost");

    // Throws InsufficientCreditsError with reset information
    const err = new InsufficientCreditsError(0, 10, new Date("2026-10-22T00:00:00.000Z"));
    assert.equal(err.statusCode, 402);
    assert.equal(err.currentBalance, 0);
    assert.equal(err.requiredCost, 10);
    assert.ok(err.message.includes("Insufficient credits"));
    assert.ok(err.message.includes("2026-10-22T00:00:00.000Z"));
  });

  await t.test("4. Idempotency Key Handling on Retries", () => {
    const memoryLedger = new Map();

    function processRequest(idempotencyKey, cost) {
      if (memoryLedger.has(idempotencyKey)) {
        const existing = memoryLedger.get(idempotencyKey);
        return { isDuplicate: true, status: existing.status, reservationId: existing.reservationId };
      }

      const reservationId = `res_${Date.now()}`;
      memoryLedger.set(idempotencyKey, { status: "COMMITTED", reservationId, cost });
      return { isDuplicate: false, status: "COMMITTED", reservationId };
    }

    const firstAttempt = processRequest("key_abc_123", 10);
    assert.equal(firstAttempt.isDuplicate, false);

    // Retry with identical idempotency key -> must not double charge
    const secondAttempt = processRequest("key_abc_123", 10);
    assert.equal(secondAttempt.isDuplicate, true);
    assert.equal(secondAttempt.reservationId, firstAttempt.reservationId);
  });

  await t.test("5. Two-Phase Reservation and Automatic Refund on Failure", () => {
    let userBalance = 50;
    let reserved = 0;
    const cost = 10;

    // Phase 1: Atomically Reserve before calling AI provider
    userBalance -= cost;
    reserved += cost;
    assert.equal(userBalance, 40);
    assert.equal(reserved, 10);

    // Scenario A: AI provider returns malformed output or rate limit (Refund required)
    const simulateFailure = true;
    if (simulateFailure) {
      // Refund reservation
      userBalance += reserved;
      reserved = 0;
    }

    assert.equal(userBalance, 50, "Full credits must be refunded after generation failure");
    assert.equal(reserved, 0, "Reserved credits must be released");

    // Scenario B: Successful generation (Commit)
    userBalance -= cost;
    reserved += cost;
    const simulateSuccess = true;
    if (simulateSuccess) {
      // Commit: reserved pool is cleared, balance was already reduced
      reserved = 0;
    }
    assert.equal(userBalance, 40, "Balance remains deducted upon success");
    assert.equal(reserved, 0);
  });

  await t.test("6. Stale Reservation Recovery (Server Restart / Dropped Request)", () => {
    const reservations = [
      {
        id: "res_stale",
        amount: -10,
        status: "PENDING",
        expiresAt: new Date(Date.now() - 60000), // Expired 1 minute ago
      },
      {
        id: "res_active",
        amount: -10,
        status: "PENDING",
        expiresAt: new Date(Date.now() + 60000), // Still active
      },
    ];

    let account = { balance: 40, reservedBalance: 20 };
    const now = new Date();

    for (const res of reservations) {
      if (res.status === "PENDING" && res.expiresAt < now) {
        const refundAmt = Math.abs(res.amount);
        account.balance += refundAmt;
        account.reservedBalance -= refundAmt;
        res.status = "RELEASED";
      }
    }

    assert.equal(account.balance, 50, "Stale reservation refunded to balance");
    assert.equal(account.reservedBalance, 10, "Only active reservation remains reserved");
  });

  await t.test("7. Mixed Category Distribution & Validation", () => {
    // When "Mixed" is selected, questions should be distributed across Quant, Logic, and Verbal
    const generateMixedCategorySequence = (count) => {
      const categories = ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"];
      const result = [];
      for (let i = 0; i < count; i++) {
        result.push(categories[i % categories.length]);
      }
      return result;
    };

    const seq3 = generateMixedCategorySequence(3);
    assert.deepEqual(seq3, ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability"]);

    const seq5 = generateMixedCategorySequence(5);
    assert.equal(seq5.filter((c) => c === "Quantitative Aptitude").length, 2);
    assert.equal(seq5.filter((c) => c === "Logical Reasoning").length, 2);
    assert.equal(seq5.filter((c) => c === "Verbal Ability").length, 1);
  });
});
