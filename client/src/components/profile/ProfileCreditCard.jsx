import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Coins,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * Formats ISO UTC reset string into user's local timezone.
 */
function formatLocalResetTime(isoString) {
  if (!isoString) return "Every day at 00:00 UTC";
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    return new Date(isoString).toLocaleString();
  }
}

function ProfileCreditCard({ credits }) {
  const [showHistory, setShowHistory] = useState(false);

  if (!credits) return null;

  const balance = credits.balance ?? 100;
  const dailyAllowance = credits.dailyAllowance ?? credits.weeklyAllowance ?? 100;
  const costPerQuestion = credits.costPerQuestion ?? 2;
  const nextResetLocal = formatLocalResetTime(credits.nextReset);
  const percentRemaining = Math.min(100, Math.max(0, Math.round((balance / dailyAllowance) * 100)));
  const recentTransactions = credits.recentTransactions || [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
            <Coins size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                Daily Application Credits
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 border border-gray-200">
                Daily Allowance
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Credits allocated to your account every day at 00:00 UTC to practice AI Mock Interviews and generate Aptitude tests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/interviews"
            className="px-3.5 py-2 rounded-xl bg-black text-white hover:bg-gray-900 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs"
          >
            <span>Mock Interview</span>
            <ArrowRight size={13} />
          </Link>
          <Link
            to="/aptitude/practice"
            className="px-3.5 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <span>Aptitude</span>
          </Link>
        </div>
      </div>

      {/* Credit Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            Remaining Credits
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-gray-900">
              {balance}
            </span>
            <span className="text-xs text-gray-400 font-medium">
              / {dailyAllowance}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentRemaining > 30 ? "bg-black" : "bg-amber-600"
              }`}
              style={{ width: `${percentRemaining}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 block pt-0.5">
            {percentRemaining}% of daily allowance remaining
          </span>
        </div>

        {/* Next Daily Reset (in User's Local Timezone) */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <Clock size={13} className="text-gray-400" />
            <span>Next Allowance Reset</span>
          </div>
          <p className="text-xs font-bold text-gray-900 leading-snug">
            {nextResetLocal}
          </p>
          <p className="text-[10px] text-gray-500 leading-tight">
            Resets every day at 00:00 UTC (shown in your local timezone).
          </p>
        </div>

        {/* Cost & Generation Policy */}
        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Generation Cost</span>
          </div>
          <p className="text-xs font-bold text-gray-900">
            {costPerQuestion} credits per question
          </p>
          <p className="text-[10px] text-gray-500 leading-tight">
            5 questions = 10 credits • 10 questions = 20 credits. Free-tier, zero extra charges.
          </p>
        </div>
      </div>

      {/* Recent Ledger History Toggle */}
      {recentTransactions.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-between w-full text-xs font-semibold text-gray-600 hover:text-black transition cursor-pointer py-1"
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>Recent Credit Activity Ledger</span>
              <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {recentTransactions.length} entries
              </span>
            </span>
            {showHistory ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {showHistory && (
            <div className="mt-3 divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-gray-50/40 text-xs">
              {recentTransactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="p-3 flex items-center justify-between gap-3 bg-white hover:bg-gray-50 transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          tx.type === "DAILY_GRANT" || tx.type === "WEEKLY_GRANT" || tx.type === "REFUND"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {tx.type}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-800 mt-1 font-medium">
                      {tx.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold ${
                        tx.amount > 0 ? "text-green-600" : "text-gray-900"
                      }`}
                    >
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} credits
                    </span>
                    <p className="text-[10px] text-gray-400">
                      Balance: {tx.balanceAfter}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileCreditCard;
