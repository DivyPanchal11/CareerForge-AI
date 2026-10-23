/**
 * Formats an ISO UTC reset timestamp into the user's local timezone.
 * Resets occur deterministically every day at 00:00 UTC.
 */
export function formatLocalResetTime(isoString) {
  if (!isoString) return "Every day at 00:00 UTC";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Every day at 00:00 UTC";
    return new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(d);
  } catch {
    try {
      return new Date(isoString).toLocaleString();
    } catch {
      return "Every day at 00:00 UTC";
    }
  }
}
