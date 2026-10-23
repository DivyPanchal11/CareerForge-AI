const AptitudeUsage = require("../models/AptitudeUsage");

/**
 * Returns current day key formatted as YYYY-MM-DD in UTC
 */
function getTodayKey() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Returns the expiration Date for today's counters (midnight tomorrow + 2 hours buffer)
 */
function getDailyExpiryDate() {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(2, 0, 0, 0);
  return tomorrow;
}

/**
 * Checks and records rate limits and cooldowns for an incoming generation request.
 *
 * @param {Object} options
 * @param {string} options.userId - ID of the authenticated user or IP address
 * @param {boolean} options.isAuthenticated - Whether user is authenticated
 * @returns {Promise<{ allowed: boolean, reason?: string, remainingUser?: number, remainingGlobal?: number, retryAfter?: number }>}
 */
async function checkAndRecordUsage({ userId, ip }) {
  const today = getTodayKey();
  const expiryDate = getDailyExpiryDate();

  const maxPerUser = parseInt(process.env.GEMINI_MAX_REQUESTS_PER_USER_PER_DAY, 10) || 5;
  const maxGlobal = parseInt(process.env.GEMINI_MAX_GLOBAL_REQUESTS_PER_DAY, 10) || 50;
  const cooldownSeconds = parseInt(process.env.GEMINI_COOLDOWN_SECONDS, 10) || 15;

  const userKey = `user_${userId || ip}_${today}`;
  const cooldownKey = `cooldown_${userId || ip}`;
  const globalKey = `global_${today}`;

  // 1. Check Cooldown
  const existingCooldown = await AptitudeUsage.findOne({ key: cooldownKey });
  if (existingCooldown) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(existingCooldown.lastRequestAt).getTime()) / 1000);
    if (elapsedSeconds < cooldownSeconds) {
      const waitSeconds = cooldownSeconds - elapsedSeconds;
      return {
        allowed: false,
        statusCode: 429,
        reason: `Please wait ${waitSeconds}s before generating more AI questions.`,
        retryAfter: waitSeconds,
      };
    }
  }

  // 2. Check Global Daily Usage
  const globalUsage = await AptitudeUsage.findOne({ key: globalKey });
  const currentGlobalCount = globalUsage ? globalUsage.count : 0;
  if (currentGlobalCount >= maxGlobal) {
    return {
      allowed: false,
      statusCode: 429,
      reason: "Global free-tier question generation limit reached for today. Please try again tomorrow.",
      remainingGlobal: 0,
    };
  }

  // 3. Check User Daily Usage
  const userUsage = await AptitudeUsage.findOne({ key: userKey });
  const currentUserCount = userUsage ? userUsage.count : 0;
  if (currentUserCount >= maxPerUser) {
    return {
      allowed: false,
      statusCode: 429,
      reason: `You have reached your daily limit of ${maxPerUser} AI question generations. Please try again tomorrow.`,
      remainingUser: 0,
    };
  }

  // 4. Update usage records atomically
  await AptitudeUsage.findOneAndUpdate(
    { key: userKey },
    {
      $inc: { count: 1 },
      $set: { lastRequestAt: new Date(), expiresAt: expiryDate },
    },
    { upsert: true, new: true }
  );

  await AptitudeUsage.findOneAndUpdate(
    { key: globalKey },
    {
      $inc: { count: 1 },
      $set: { lastRequestAt: new Date(), expiresAt: expiryDate },
    },
    { upsert: true, new: true }
  );

  // Set/update cooldown
  const cooldownExpiry = new Date(Date.now() + (cooldownSeconds + 5) * 1000);
  await AptitudeUsage.findOneAndUpdate(
    { key: cooldownKey },
    {
      $set: { lastRequestAt: new Date(), expiresAt: cooldownExpiry },
    },
    { upsert: true, new: true }
  );

  return {
    allowed: true,
    remainingUser: Math.max(0, maxPerUser - (currentUserCount + 1)),
    remainingGlobal: Math.max(0, maxGlobal - (currentGlobalCount + 1)),
    cooldownSeconds,
  };
}

/**
 * Gets remaining usage for user without incrementing counters.
 */
async function getUserUsageStatus({ userId, ip }) {
  const today = getTodayKey();
  const maxPerUser = parseInt(process.env.GEMINI_MAX_REQUESTS_PER_USER_PER_DAY, 10) || 5;
  const maxGlobal = parseInt(process.env.GEMINI_MAX_GLOBAL_REQUESTS_PER_DAY, 10) || 50;

  const userKey = `user_${userId || ip}_${today}`;
  const globalKey = `global_${today}`;

  const [userUsage, globalUsage] = await Promise.all([
    AptitudeUsage.findOne({ key: userKey }),
    AptitudeUsage.findOne({ key: globalKey }),
  ]);

  const userCount = userUsage ? userUsage.count : 0;
  const globalCount = globalUsage ? globalUsage.count : 0;

  return {
    userCount,
    maxPerUser,
    remainingUser: Math.max(0, maxPerUser - userCount),
    globalCount,
    maxGlobal,
    remainingGlobal: Math.max(0, maxGlobal - globalCount),
  };
}

module.exports = {
  checkAndRecordUsage,
  getUserUsageStatus,
};
