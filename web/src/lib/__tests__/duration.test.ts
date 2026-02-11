import { formatDuration, parseIsoDurationToSeconds } from '../duration';

describe('duration', () => {
  test('parseIsoDurationToSeconds', () => {
    expect(parseIsoDurationToSeconds('PT56M33S')).toBe(56 * 60 + 33);
    expect(parseIsoDurationToSeconds('PT1H2M3S')).toBe(1 * 3600 + 2 * 60 + 3);
    expect(parseIsoDurationToSeconds('PT0S')).toBe(0);
    expect(parseIsoDurationToSeconds('')).toBeNull();
    expect(parseIsoDurationToSeconds(null)).toBeNull();
    expect(parseIsoDurationToSeconds('P1D')).toBeNull();
  });

  test('formatDuration', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(59)).toBe('0:59');
    expect(formatDuration(60)).toBe('1:00');
    expect(formatDuration(61)).toBe('1:01');
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(3723)).toBe('1:02:03');
    expect(formatDuration(null)).toBe('-');
  });
});
