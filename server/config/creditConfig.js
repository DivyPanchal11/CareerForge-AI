/**
 * Configurable Daily Credit System Settings
 *
 * Configures daily allowance, generation cost per question,
 * and deterministic daily 00:00 UTC reset boundaries.
 */

const DEFAULT_DAILY_ALLOWANCE =
  parseInt(
    process.env.DAILY_CREDIT_ALLOWANCE ||
      process.env.INTERVIEW_DAILY_CREDIT_ALLOWANCE ||
      process.env.APTITUDE_DAILY_CREDIT_ALLOWANCE ||
      process.env.APTITUDE_CREDIT_ALLOWANCE ||
      process.env.APTITUDE_WEEKLY_CREDIT_ALLOWANCE,
    10
  ) || 100;

const DEFAULT_WEEKLY_ALLOWANCE = DEFAULT_DAILY_ALLOWANCE; // Aliased for backwards compatibility
const COST_PER_QUESTION =
  parseInt(
    process.env.CREDIT_COST_PER_QUESTION ||
      process.env.INTERVIEW_CREDIT_COST_PER_QUESTION ||
      process.env.APTITUDE_CREDIT_COST_PER_QUESTION,
    10
  ) || 2;

const BASE_GENERATION_COST =
  parseInt(
    process.env.BASE_CREDIT_COST ||
      process.env.INTERVIEW_BASE_CREDIT_COST ||
      process.env.APTITUDE_BASE_CREDIT_COST,
    10
  ) || 0;

const RESERVATION_EXPIRY_MS =
  (parseInt(
    process.env.CREDIT_RESERVATION_EXPIRY_SECONDS ||
      process.env.INTERVIEW_RESERVATION_EXPIRY_SECONDS ||
      process.env.APTITUDE_RESERVATION_EXPIRY_SECONDS,
    10
  ) || 300) * 1000;

/**
 * Calculates credit cost for a given question count.
 * Server is always the source of truth for cost calculations.
 *
 * @param {number} questionCount
 * @returns {number}
 */
function calculateGenerationCost(questionCount) {
  const parsed = parseInt(questionCount, 10);
  const count = isNaN(parsed) || parsed < 1 ? 1 : parsed;
  return BASE_GENERATION_COST + count * COST_PER_QUESTION;
}

/**
 * Returns the current day's reset boundary (Today 00:00:00.000 UTC)
 * and the next reset boundary (Tomorrow 00:00:00.000 UTC).
 *
 * Rule: Reset allowances every day at 00:00:00 UTC across the entire system.
 *
 * @param {Date|number|string} [referenceDate=new Date()]
 * @returns {{ periodStart: Date, nextReset: Date }}
 */
function getDailyResetWindow(referenceDate = new Date()) {
  const d = new Date(referenceDate);
  const periodStart = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0)
  );
  const nextReset = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0)
  );

  return {
    periodStart,
    nextReset,
  };
}

module.exports = {
  DEFAULT_DAILY_ALLOWANCE,
  DEFAULT_WEEKLY_ALLOWANCE,
  COST_PER_QUESTION,
  BASE_GENERATION_COST,
  RESERVATION_EXPIRY_MS,
  calculateGenerationCost,
  getDailyResetWindow,
  getResetWindow: getDailyResetWindow,
  getWeeklyResetWindow: getDailyResetWindow, // Aliased for backwards compatibility
};
