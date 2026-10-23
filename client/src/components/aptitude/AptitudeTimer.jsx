import { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";

function AptitudeTimer({
  initialSeconds = 900,
  startedAt = null,
  totalDurationSeconds = null,
  onExpire = null,
  isFinished = false,
  onTick = null,
  onOneMinuteWarning = null,
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

  // Compute true remaining seconds using timestamp if startedAt is provided,
  // falling back to initialSeconds decrement anchored at mount time.
  const mountTimeRef = useRef(Date.now());
  const initialSecondsRef = useRef(initialSeconds);

  useEffect(() => {
    initialSecondsRef.current = initialSeconds;
    mountTimeRef.current = Date.now();
  }, [initialSeconds]);

  const computeRemaining = () => {
    if (isFinished) return 0;

    if (startedAt && totalDurationSeconds) {
      const startMs = new Date(startedAt).getTime();
      const elapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
      return Math.max(0, totalDurationSeconds - elapsed);
    }

    const elapsed = Math.max(0, Math.floor((Date.now() - mountTimeRef.current) / 1000));
    return Math.max(0, initialSecondsRef.current - elapsed);
  };

  const [secondsLeft, setSecondsLeft] = useState(computeRemaining);

  useEffect(() => {
    const remaining = computeRemaining();
    setSecondsLeft(remaining);
    hasExpiredRef.current = remaining <= 0;

    if (remaining <= 60 && remaining > 0 && onOneMinuteWarningRef.current) {
      onOneMinuteWarningRef.current(remaining);
    }
  }, [startedAt, totalDurationSeconds, initialSeconds, isFinished]);

  useEffect(() => {
    if (isFinished) return;

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

    tick();
    const interval = setInterval(tick, 1000);

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
  }, [isFinished, startedAt, totalDurationSeconds]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const isWarning = secondsLeft <= 60 && secondsLeft > 0;
  const isExpired = secondsLeft === 0;

  const accessibleLabel = isExpired
    ? "Aptitude test time has expired"
    : `Aptitude test timer: ${mins} minute${mins === 1 ? "" : "s"} and ${secs} second${secs === 1 ? "" : "s"} remaining`;

  return (
    <div
      role="timer"
      aria-label={accessibleLabel}
      aria-live={isWarning ? "assertive" : "off"}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
        isExpired
          ? "border-rose-300 bg-rose-50 text-rose-700"
          : isWarning
          ? "border-amber-300 bg-amber-50 text-amber-700 animate-pulse"
          : "border-gray-200 bg-white text-gray-800 shadow-2xs"
      }`}
    >
      {isWarning || isExpired ? (
        <AlertTriangle size={14} className={isExpired ? "text-rose-600" : "text-amber-600"} aria-hidden="true" />
      ) : (
        <Clock size={14} className="text-gray-500" aria-hidden="true" />
      )}
      <span>{isExpired ? "Time Expired" : formattedTime}</span>
    </div>
  );
}

export default AptitudeTimer;
