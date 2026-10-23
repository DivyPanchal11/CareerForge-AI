const CreditAccount = require("../models/CreditAccount");
const CreditLedger = require("../models/CreditLedger");
const {
  DEFAULT_DAILY_ALLOWANCE,
  DEFAULT_WEEKLY_ALLOWANCE,
  COST_PER_QUESTION,
  RESERVATION_EXPIRY_MS,
  calculateGenerationCost,
  getDailyResetWindow,
} = require("../config/creditConfig");

class InsufficientCreditsError extends Error {
  constructor(currentBalance, requiredCost, nextReset) {
    super(
      `Insufficient credits. You need ${requiredCost} credits to generate this practice set, but have only ${currentBalance} remaining. Your allowance will reset on ${nextReset.toISOString()}.`
    );
    this.name = "InsufficientCreditsError";
    this.statusCode = 402;
    this.currentBalance = currentBalance;
    this.requiredCost = requiredCost;
    this.nextReset = nextReset;
  }
}

/**
 * Reconciles any expired pending reservations for a user.
 * Ensures that if a server crashed or an uncommitted request was dropped,
 * credits are safely refunded back to the user's available balance.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 */
async function reconcileStaleReservations(userId) {
  try {
    const now = new Date();
    const staleReservations = await CreditLedger.find({
      userId,
      status: "PENDING",
      expiresAt: { $lt: now },
    });

    for (const res of staleReservations) {
      const cost = Math.abs(res.amount);

      // Atomically restore balance
      const updated = await CreditAccount.findOneAndUpdate(
        { userId },
        {
          $inc: { balance: cost, reservedBalance: -cost },
        },
        { new: true }
      );

      // Mark reservation released
      res.status = "RELEASED";
      res.metadata = {
        ...res.metadata,
        releasedReason: "Automatic recovery: reservation expired",
      };
      await res.save();

      // Record refund in ledger
      await CreditLedger.create({
        userId,
        type: "REFUND",
        amount: cost,
        balanceAfter: updated ? updated.balance : 0,
        reservationId: res.reservationId,
        status: "COMPLETED",
        description: `Automatic refund of ${cost} expired reserved credits`,
        metadata: {
          originalReservationId: res.reservationId,
          recoveredAt: now,
        },
      });
    }
  } catch (error) {
    console.error("[CreditService] reconcileStaleReservations error:", error.message);
  }
}

/**
 * Reconciles expired pending reservations across all users.
 * Ideal for server startup hook or background cleanup task.
 */
async function reconcileAllStaleReservations() {
  try {
    const now = new Date();
    const staleUserIds = await CreditLedger.distinct("userId", {
      status: "PENDING",
      expiresAt: { $lt: now },
    });

    for (const uid of staleUserIds) {
      await reconcileStaleReservations(uid);
    }

    if (staleUserIds.length > 0) {
      console.log(`[CreditService] Reconciled expired reservations for ${staleUserIds.length} users.`);
    }
  } catch (error) {
    console.error("[CreditService] reconcileAllStaleReservations error:", error.message);
  }
}

/**
 * Gets or creates the user's credit account, applying deterministic lazy daily resets.
 * Standard Reset Rule: Every day at 00:00:00.000 UTC.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<{ account: any, nextReset: Date, dailyAllowance: number, weeklyAllowance: number, costPerQuestion: number }>}
 */
async function getOrCreateAccount(userId) {
  const { periodStart, nextReset } = getDailyResetWindow();

  let account = await CreditAccount.findOne({ userId });

  if (!account) {
    // New user account creation
    account = await CreditAccount.create({
      userId,
      balance: DEFAULT_DAILY_ALLOWANCE,
      reservedBalance: 0,
      dailyAllowance: DEFAULT_DAILY_ALLOWANCE,
      weeklyAllowance: DEFAULT_DAILY_ALLOWANCE,
      lastResetPeriodStart: periodStart,
    });

    await CreditLedger.create({
      userId,
      type: "DAILY_GRANT",
      amount: DEFAULT_DAILY_ALLOWANCE,
      balanceAfter: DEFAULT_DAILY_ALLOWANCE,
      status: "COMPLETED",
      description: "Initial daily credit allowance grant",
      metadata: { periodStart },
    });
  } else {
    // Check if current time has crossed into a new daily reset window
    const lastReset = new Date(account.lastResetPeriodStart);
    if (lastReset < periodStart) {
      // Deterministic daily reset to allowance
      const allowance = account.dailyAllowance || account.weeklyAllowance || DEFAULT_DAILY_ALLOWANCE;

      account = await CreditAccount.findOneAndUpdate(
        { userId },
        {
          $set: {
            balance: allowance,
            reservedBalance: 0,
            lastResetPeriodStart: periodStart,
          },
        },
        { new: true }
      );

      await CreditLedger.create({
        userId,
        type: "DAILY_GRANT",
        amount: allowance,
        balanceAfter: allowance,
        status: "COMPLETED",
        description: "Daily credit allowance reset (00:00 UTC)",
        metadata: { periodStart, previousLastReset: lastReset },
      });
    }
  }

  // Ensure dailyAllowance matches the full configured daily allowance (100)
  if (!account.dailyAllowance || account.dailyAllowance < DEFAULT_DAILY_ALLOWANCE) {
    account = await CreditAccount.findOneAndUpdate(
      { userId },
      {
        $set: {
          dailyAllowance: DEFAULT_DAILY_ALLOWANCE,
          weeklyAllowance: DEFAULT_DAILY_ALLOWANCE,
        },
      },
      { new: true }
    );
  }

  // Reconcile any orphaned/stale reservations
  await reconcileStaleReservations(userId);

  const effectiveAllowance =
    account.dailyAllowance || account.weeklyAllowance || DEFAULT_DAILY_ALLOWANCE;

  return {
    account,
    nextReset,
    dailyAllowance: effectiveAllowance,
    weeklyAllowance: effectiveAllowance, // Aliased for backward compatibility
    costPerQuestion: COST_PER_QUESTION,
  };
}

/**
 * Atomically reserves credits before AI generation starts.
 * Protects against overspend with concurrency-safe atomic query:
 *   CreditAccount.findOneAndUpdate({ userId, balance: { $gte: cost } }, ...)
 *
 * Checks idempotencyKey to prevent duplicate charges on retry.
 *
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @param {number} params.questionCount
 * @param {string} [params.idempotencyKey]
 * @param {Object} [params.metadata]
 * @returns {Promise<{ reservationId: string, cost: number, balanceAfter: number, isIdempotentDuplicate?: boolean }>}
 */
async function reserveCredits({ userId, questionCount, idempotencyKey, metadata = {} }) {
  const { periodStart, nextReset } = getDailyResetWindow();
  const cost = calculateGenerationCost(questionCount);

  // 1. Check idempotency if key is provided
  if (idempotencyKey && typeof idempotencyKey === "string" && idempotencyKey.trim()) {
    const cleanKey = idempotencyKey.trim();
    const existing = await CreditLedger.findOne({ userId, idempotencyKey: cleanKey });

    if (existing) {
      if (existing.status === "COMMITTED") {
        return {
          isIdempotentDuplicate: true,
          status: "COMMITTED",
          cost: Math.abs(existing.amount),
          reservationId: existing.reservationId,
          metadata: existing.metadata,
        };
      }

      if (existing.status === "PENDING" && existing.expiresAt > new Date()) {
        return {
          isIdempotentDuplicate: true,
          status: "PENDING",
          cost: Math.abs(existing.amount),
          reservationId: existing.reservationId,
          balanceAfter: existing.balanceAfter,
        };
      }
    }
  }

  // 2. Ensure account is up to date (applies lazy weekly reset if needed)
  await getOrCreateAccount(userId);

  // 3. Atomically reserve credits
  const updatedAccount = await CreditAccount.findOneAndUpdate(
    {
      userId,
      balance: { $gte: cost },
    },
    {
      $inc: { balance: -cost, reservedBalance: cost },
    },
    { new: true }
  );

  if (!updatedAccount) {
    const currentAcc = await CreditAccount.findOne({ userId });
    const currentBal = currentAcc ? currentAcc.balance : 0;
    throw new InsufficientCreditsError(currentBal, cost, nextReset);
  }

  // 4. Create pending reservation record in ledger
  const reservationId = `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const expiresAt = new Date(Date.now() + RESERVATION_EXPIRY_MS);

  await CreditLedger.create({
    userId,
    type: "RESERVE",
    amount: -cost,
    balanceAfter: updatedAccount.balance,
    reservationId,
    idempotencyKey: idempotencyKey || null,
    status: "PENDING",
    description: `Reserved ${cost} credits for generating ${questionCount} questions`,
    metadata: {
      questionCount,
      cost,
      ...metadata,
    },
    expiresAt,
  });

  return {
    reservationId,
    cost,
    balanceAfter: updatedAccount.balance,
    weeklyAllowance: updatedAccount.weeklyAllowance,
  };
}

/**
 * Commits a pending reservation after questions have successfully generated and passed verification.
 *
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @param {string} params.reservationId
 * @param {Object} [params.metadata]
 */
async function commitReservation({ userId, reservationId, metadata = {} }) {
  if (!reservationId) return null;

  const reservation = await CreditLedger.findOne({
    userId,
    reservationId,
    status: "PENDING",
  });

  if (!reservation) {
    return null;
  }

  const cost = Math.abs(reservation.amount);

  // Atomically release the hold from reservedBalance
  await CreditAccount.updateOne(
    { userId },
    {
      $inc: { reservedBalance: -cost },
    }
  );

  // Mark reservation committed in ledger
  reservation.status = "COMMITTED";
  reservation.type = "COMMIT";
  reservation.description = `Committed ${cost} credits for question generation`;
  reservation.metadata = {
    ...reservation.metadata,
    ...metadata,
    committedAt: new Date(),
  };
  await reservation.save();

  return reservation;
}

/**
 * Refunds and releases a pending reservation upon generation failure, timeout, or validation rejection.
 *
 * @param {Object} params
 * @param {string|mongoose.Types.ObjectId} params.userId
 * @param {string} params.reservationId
 * @param {string} [params.reason]
 * @param {Object} [params.metadata]
 */
async function refundReservation({ userId, reservationId, reason = "Generation failed", metadata = {} }) {
  if (!reservationId) return null;

  const reservation = await CreditLedger.findOne({
    userId,
    reservationId,
    status: "PENDING",
  });

  if (!reservation) {
    return null;
  }

  const cost = Math.abs(reservation.amount);

  // Atomically return credits to available balance and decrement hold
  const updatedAccount = await CreditAccount.findOneAndUpdate(
    { userId },
    {
      $inc: { balance: cost, reservedBalance: -cost },
    },
    { new: true }
  );

  // Update original reservation
  reservation.status = "RELEASED";
  reservation.metadata = {
    ...reservation.metadata,
    refundReason: reason,
    releasedAt: new Date(),
  };
  await reservation.save();

  // Create explicit refund entry in ledger
  await CreditLedger.create({
    userId,
    type: "REFUND",
    amount: cost,
    balanceAfter: updatedAccount ? updatedAccount.balance : 0,
    reservationId,
    status: "COMPLETED",
    description: `Refunded ${cost} credits: ${reason}`,
    metadata: {
      originalReservationId: reservationId,
      reason,
      ...metadata,
    },
  });

  return updatedAccount;
}

/**
 * Retrieves the full user credit summary including balance, allowance, next reset time, and recent ledger history.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object>}
 */
async function getUserCreditSummary(userId) {
  const { account, nextReset, dailyAllowance, weeklyAllowance, costPerQuestion } =
    await getOrCreateAccount(userId);

  const recentTransactions = await CreditLedger.find({ userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .select("type amount balanceAfter description status createdAt metadata")
    .lean();

  return {
    balance: account.balance,
    reservedBalance: account.reservedBalance,
    dailyAllowance,
    weeklyAllowance, // Aliased for backwards compatibility
    resetPeriod: "daily",
    nextReset: nextReset.toISOString(),
    costPerQuestion,
    recentTransactions,
  };
}

module.exports = {
  InsufficientCreditsError,
  getOrCreateAccount,
  reserveCredits,
  commitReservation,
  refundReservation,
  reconcileStaleReservations,
  reconcileAllStaleReservations,
  getUserCreditSummary,
};
