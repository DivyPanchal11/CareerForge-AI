import { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { INTERVIEW_QUESTION_DURATION_SECONDS } from "../../constants/interviewConstants";

function InterviewTimer({
  durationSeconds = INTERVIEW_QUESTION_DURATION_SECONDS,
  startedAt = null,
  accumulatedElapsed = 0,
  onExpire = null,
  onTick = null,
  onOneMinuteWarning = null,
  isCompleted = false,
  isPaused = false,
}) {
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  const onOneMinuteWarningRef = useRef(onOneMinuteWarning);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    onOneMinuteWarningRef.current = onOneMinuteWarning;
  }, [onOneMinuteWarning]);

  const computeRemaining = () => {
    if (isCompleted) return 0;
    const now = Date.now();
    const activeElapsed = startedAt && !isPaused ? Math.max(0, Math.floor((now - startedAt) / 1000)) : 0;
    const totalElapsed = (accumulatedElapsed || 0) + activeElapsed;
    return Math.max(0, durationSeconds - totalElapsed);
  };

  const [secondsLeft, setSecondsLeft] = useState(computeRemaining);

  // Sync state when props change (e.g. user moves to another question or refreshes)
  useEffect(() => {
    const remaining = computeRemaining();
    setSecondsLeft(remaining);
    hasExpiredRef.current = remaining <= 0;

    if (remaining <= 60 && remaining > 0 && onOneMinuteWarningRef.current) {
      onOneMinuteWarningRef.current(remaining);
    }
  }, [durationSeconds, startedAt, accumulatedElapsed, isCompleted, isPaused]);

  useEffect(() => {
    if (isCompleted || isPaused) return;

    const tick = () => {
      const remaining = computeRemaining();
      setSecondsLeft(remaining);

      if (onTickRef.current) {
        onTickRef.current(remaining);
      }

      if (remaining <= 60 && remaining > 0 && onOneMinuteWarningRef.current) {
        onOneMinuteWarningRef.current(remaining);
      }

      if (remaining <= 0) {
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (onExpireRef.current) {
            onExpireRef.current();
          }
        }
      }
    };

    // Immediate tick to catch up
    tick();

    const interval = setInterval(tick, 1000);

    // Visibility change handler to immediately catch up when tab returns from background or sleep
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [durationSeconds, startedAt, accumulatedElapsed, isCompleted, isPaused]);

  // Format time MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isWarning = secondsLeft <= 60 && secondsLeft > 0;
  const isExpired = secondsLeft === 0;

  const accessibleLabel = isExpired
    ? "Question answer time has expired"
    : `Question answer timer: ${mins} minute${mins === 1 ? "" : "s"} and ${secs} second${secs === 1 ? "" : "s"} remaining`;

  return (
    <div
      role="timer"
      aria-label={accessibleLabel}
      aria-live={isWarning ? "assertive" : "off"}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
        isExpired
          ? "border-red-300 bg-red-50 text-red-600"
          : isWarning
          ? "border-amber-300 bg-amber-50 text-amber-700 animate-pulse"
          : "border-gray-200 bg-white text-gray-800 shadow-2xs"
      }`}
    >
      {isWarning || isExpired ? (
        <AlertTriangle size={14} className={isExpired ? "text-red-500" : "text-amber-500"} aria-hidden="true" />
      ) : (
        <Clock size={14} className="text-gray-500" aria-hidden="true" />
      )}

      <span>{isExpired ? "Time Expired" : formattedTime}</span>
      <span className="sr-only">({isExpired ? "Time Expired" : "5 minutes allowed per question"})</span>
    </div>
  );
}

export default InterviewTimer;
