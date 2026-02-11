const fmtJstYmd = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Convert an ISO timestamp (or any Date-parsable string) into a JST YYYY-MM-DD string.
 */
export function toYmdJst(isoLike: string | null | undefined): string {
  if (!isoLike) return '';
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return '';
  return fmtJstYmd.format(date);
}

/**
 * Convert a JST YYYY-MM-DD into milliseconds at JST midnight.
 */
export function ymdToDayNumJst(ymd: string | null | undefined): number | null {
  if (!ymd) return null;
  const ms = Date.parse(`${ymd}T00:00:00+09:00`);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Day-of-week for a JST date (YYYY-MM-DD) computed using noon JST.
 * Using noon avoids edge cases where UTC date differs from JST date.
 */
export function dowForJstNoon(ymd: string): number {
  const ms = Date.parse(`${ymd}T12:00:00+09:00`);
  const d = new Date(ms);
  return d.getUTCDay(); // 0..6
}

export function getTodayYmdJst(): string {
  return fmtJstYmd.format(new Date());
}

/**
 * Convert Unix epoch seconds (UTC) to JST YYYY-MM-DD string.
 */
export function epochSecToYmdJst(epochSec: number): string {
  const date = new Date(epochSec * 1000);
  if (Number.isNaN(date.getTime())) return '';
  return fmtJstYmd.format(date);
}

/**
 * Convert Unix epoch seconds to ISO 8601 string.
 */
export function epochSecToIso(epochSec: number): string {
  const date = new Date(epochSec * 1000);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString();
}
