/**
 * Utilities for ISO 8601 duration strings.
 *
 * Example: "PT1H2M3S" -> 3723 seconds
 */

export function parseIsoDurationToSeconds(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return null;

  const h = Number.parseInt(match[1] ?? '0', 10);
  const m = Number.parseInt(match[2] ?? '0', 10);
  const s = Number.parseInt(match[3] ?? '0', 10);

  if ([h, m, s].some((v) => Number.isNaN(v) || v < 0)) return null;

  return h * 3600 + m * 60 + s;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds < 0 || !Number.isFinite(seconds)) return '-';

  const sec = Math.floor(seconds);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function minutesToSeconds(minutes: number | null | undefined): number | null {
  if (minutes == null || !Number.isFinite(minutes)) return null;
  const m = Math.round(minutes);
  if (m <= 0) return 0;
  return m * 60;
}
