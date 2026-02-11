import { dowForJstNoon, toYmdJst, ymdToDayNumJst, epochSecToYmdJst, epochSecToIso } from '../date';

describe('date', () => {
  test('toYmdJst converts to JST date', () => {
    expect(toYmdJst('2019-11-30T13:33:26Z')).toBe('2019-11-30');
    expect(toYmdJst('2019-11-30T15:30:00Z')).toBe('2019-12-01');
  });

  test('ymdToDayNumJst monotonically increases', () => {
    const a = ymdToDayNumJst('2019-11-30');
    const b = ymdToDayNumJst('2019-12-01');
    expect(a).not.toBeNull();
    expect(b).not.toBeNull();
    expect(b!).toBeGreaterThan(a!);
  });

  test('dowForJstNoon returns valid dow', () => {
    const d = dowForJstNoon('2020-01-01');
    expect(d).toBeGreaterThanOrEqual(0);
    expect(d).toBeLessThanOrEqual(6);
  });

  test('epochSecToYmdJst converts epoch seconds to JST date', () => {
    // 2024-01-01 00:00:00 UTC = 2024-01-01 09:00:00 JST
    expect(epochSecToYmdJst(1704067200)).toBe('2024-01-01');
    // 2024-01-01 15:00:00 UTC = 2024-01-02 00:00:00 JST
    expect(epochSecToYmdJst(1704121200)).toBe('2024-01-02');
  });

  test('epochSecToYmdJst handles invalid input', () => {
    expect(epochSecToYmdJst(NaN)).toBe('');
  });

  test('epochSecToIso converts epoch seconds to ISO string', () => {
    // 2024-01-01 00:00:00 UTC
    expect(epochSecToIso(1704067200)).toBe('2024-01-01T00:00:00.000Z');
  });

  test('epochSecToIso handles invalid input', () => {
    expect(epochSecToIso(NaN)).toBe('');
  });
});
