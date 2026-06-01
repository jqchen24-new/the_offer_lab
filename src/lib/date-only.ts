/** Parse YYYY-MM-DD from a date input; store as UTC noon to avoid timezone shifts. */
export function parseDateInput(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return new Date(NaN);
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0));
}

/** Format a stored calendar date for `<input type="date">`. */
export function toDateInputValue(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format a stored calendar date for display (e.g. date applied). */
export function formatDateOnly(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()).toLocaleDateString();
}

/** Format a real timestamp for display (e.g. status last updated). */
export function formatTimestampDate(value: Date | string): string {
  return new Date(value).toLocaleDateString();
}

/** Today's date as YYYY-MM-DD in the user's timezone when tzOffset is available. */
export function todayDateInputValue(tzOffsetMinutes?: number | null): string {
  const now = Date.now();
  if (
    tzOffsetMinutes != null &&
    !Number.isNaN(tzOffsetMinutes) &&
    Math.abs(tzOffsetMinutes) <= 14 * 60
  ) {
    const local = new Date(now - tzOffsetMinutes * 60_000);
    return `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}-${String(local.getUTCDate()).padStart(2, "0")}`;
  }
  const d = new Date(now);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
