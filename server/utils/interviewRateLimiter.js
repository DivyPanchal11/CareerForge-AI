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
 * Checks and records rate limits and cooldowns for an interview question generation request.
 *
 * @param {Object} options
 * @param {string} options.userId - ID of the authenticated user or IP address
 * @param {string} [options.ip] - IP address of the client
 * @returns {Promise<{ allowed: boolean, statusCode?: number, reason?: string, retryAfter?: number }>}
 */
async function checkInterviewUsage({ userId, ip }) {
  const today = getTodayKey();
  const expiryDate = getDailyExpiryDate();

  const maxPerUser = parseInt(process.env.INTERVIEW_MAX_REQUESTS_PER_USER_PER_DAY, 10) || 15;
  const maxGlobal = parseInt(process.env.INTERVIEW_MAX_GLOBAL_REQUESTS_PER_DAY, 10) || 100;
  const cooldownSeconds = parseInt(process.env.INTERVIEW_COOLDOWN_SECONDS, 10) || 10;

  const userKey = `interview_user_${userId || ip}_${today}`;
  const cooldownKey = `interview_cooldown_${userId || ip}`;
  const globalKey = `interview_global_${today}`;

  try {
    // 1. Check Cooldown
    const existingCooldown = await AptitudeUsage.findOne({ key: cooldownKey });
    if (existingCooldown) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(existingCooldown.lastRequestAt).getTime()) / 1000);
      if (elapsedSeconds < cooldownSeconds) {
        const waitSeconds = cooldownSeconds - elapsedSeconds;
        return {
          allowed: false,
          statusCode: 429,
          reason: `Please wait ${waitSeconds}s before initiating another interview generation.`,
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
        reason: "Global interview question generation limit reached for today. Please try again tomorrow.",
      };
    }

    // 3. Check User Daily Usage
    const userUsage = await AptitudeUsage.findOne({ key: userKey });
    const currentUserCount = userUsage ? userUsage.count : 0;
    if (currentUserCount >= maxPerUser) {
      return {
        allowed: false,
        statusCode: 429,
        reason: `You have reached your daily interview generation limit of ${maxPerUser} sessions. Please try again tomorrow.`,
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

    return { allowed: true };
  } catch (err) {
    // Graceful degradation on rate-limiter failure so users aren't blocked if counter store is busy
    console.warn("[InterviewRateLimiter] Warning during check:", err.message);
    return { allowed: true };
  }
}

module.exports = {
  checkInterviewUsage,
};
