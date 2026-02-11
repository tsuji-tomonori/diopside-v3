import type { VideoItem } from './data';

export type TagMode = 'AND' | 'OR';
export type SortOrder = 'asc' | 'desc';

export type DateRange = {
  fromYmd: string | null;
  toYmd: string | null;
  fromDay: number | null;
  toDay: number | null;
};

export type DurationRange = {
  minMinutes: number;
  maxMinutes: number;
  maxBoundMinutes: number;
};

export type FilterState = {
  q: string;
  selectedTags: Set<string>;
  tagMode: TagMode;
  sortOrder: SortOrder;
  dateRange: DateRange;
  durationRange: DurationRange;
};

export function tokenize(query: string): string[] {
  return query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
}

export function matchesItem(item: VideoItem, state: FilterState): boolean {
  const tokens = tokenize(state.q);
  if (tokens.length) {
    for (const tok of tokens) {
      if (!item.searchText.includes(tok)) return false;
    }
  }

  if (state.selectedTags.size > 0) {
    const set = new Set(item.tags);
    if (state.tagMode === 'AND') {
      for (const t of state.selectedTags) {
        if (!set.has(t)) return false;
      }
    } else {
      let ok = false;
      for (const t of state.selectedTags) {
        if (set.has(t)) {
          ok = true;
          break;
        }
      }
      if (!ok) return false;
    }
  }

  // Date range filter
  const { fromDay, toDay } = state.dateRange;
  if (fromDay != null || toDay != null) {
    if (item.dayNum == null) return false;
    const from = fromDay != null ? fromDay : Number.NEGATIVE_INFINITY;
    const to = toDay != null ? toDay : fromDay != null ? fromDay : Number.POSITIVE_INFINITY;
    if (item.dayNum < from || item.dayNum > to) return false;
  }

  // Duration filter
  const { minMinutes, maxMinutes, maxBoundMinutes } = state.durationRange;
  const durationMinSec = minMinutes <= 0 ? null : minMinutes * 60;
  const durationMaxSec = maxMinutes >= maxBoundMinutes ? null : maxMinutes * 60;

  if (durationMinSec != null || durationMaxSec != null) {
    if (item.durationSec == null) return false;
    if (durationMinSec != null && item.durationSec < durationMinSec) return false;
    if (durationMaxSec != null && item.durationSec > durationMaxSec) return false;
  }

  return true;
}

export function applyFilters(items: VideoItem[], state: FilterState): VideoItem[] {
  const filtered = items.filter((it) => matchesItem(it, state));
  const sorted = filtered.slice().sort((a, b) => {
    if (state.sortOrder === 'asc') return a.dateNum - b.dateNum;
    return b.dateNum - a.dateNum;
  });
  return sorted;
}
