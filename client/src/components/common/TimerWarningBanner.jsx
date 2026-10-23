import { AlertTriangle, X } from "lucide-react";

/**
 * Accessible in-app 1-minute warning banner for interview and aptitude timers.
 * - Screen-reader accessible via role="alert" and aria-live="polite"
 * - Does not rely on color alone (includes clear text and AlertTriangle icon)
 * - Non-intrusive: does not steal focus, interrupt typing, or conceal question content
 */
function TimerWarningBanner({
  message = "1 minute left. Finish your answer before time runs out.",
  onDismiss = null,
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border border-amber-300 bg-amber-50 text-amber-900 shadow-xs transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
          <AlertTriangle size={18} aria-hidden="true" />
        </div>
        <div>
          <span className="text-xs font-bold block sm:inline mr-2">
            Time Notice:
          </span>
          <span className="text-xs font-semibold leading-relaxed">
            {message}
          </span>
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-amber-700 hover:text-amber-900 hover:bg-amber-100/80 transition cursor-pointer shrink-0"
          title="Dismiss notice"
          aria-label="Dismiss 1 minute warning"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default TimerWarningBanner;
