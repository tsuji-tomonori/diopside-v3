export function parseMaybeJsonOrJsonl<T = unknown>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      throw e;
    }

    const arr: unknown[] = [];
    for (const line of lines) {
      try {
        arr.push(JSON.parse(line));
      } catch {
        // ignore malformed rows (best-effort)
      }
    }

    if (arr.length > 0) {
      return arr as unknown as T;
    }

    throw e;
  }
}
