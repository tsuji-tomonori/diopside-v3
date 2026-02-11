import type { VideoItem } from '../data';
import { applyFilters, type FilterState } from '../filter';

function v(partial: Partial<VideoItem> & { videoId: string }): VideoItem {
  return {
    videoId: partial.videoId,
    title: partial.title ?? partial.videoId,
    description: partial.description ?? '',
    publishedAt: partial.publishedAt ?? '',
    tags: partial.tags ?? [],
    durationIso: partial.durationIso ?? null,
    ymd: partial.ymd ?? '',
    dayNum: partial.dayNum ?? null,
    year: partial.year ?? null,
    dateNum: partial.dateNum ?? (partial.dayNum ?? Number.NEGATIVE_INFINITY),
    durationSec: partial.durationSec ?? null,
    searchText: partial.searchText ?? `${(partial.title ?? partial.videoId)} ${partial.videoId} ${(partial.tags ?? []).join(' ')}`.toLocaleLowerCase(),
  };
}

describe('filter', () => {
  const items = [
    v({ videoId: 'a', title: 'Hello World', tags: ['企画', 'トーク'], ymd: '2020-01-01', dayNum: 1, dateNum: 1, durationSec: 60 }),
    v({ videoId: 'b', title: 'Another Video', tags: ['ゲーム'], ymd: '2021-01-01', dayNum: 100, dateNum: 100, durationSec: 3600 }),
    v({ videoId: 'c', title: 'No Date', tags: ['企画'], ymd: '', dayNum: null, dateNum: Number.NEGATIVE_INFINITY, durationSec: 120 }),
  ];

  const baseState: FilterState = {
    q: '',
    selectedTags: new Set<string>(),
    tagMode: 'AND',
    sortOrder: 'desc',
    dateRange: { fromYmd: null, toYmd: null, fromDay: null, toDay: null },
    durationRange: { minMinutes: 0, maxMinutes: 240, maxBoundMinutes: 240 },
  };

  test('query tokens are ANDed', () => {
    const s: FilterState = { ...baseState, q: 'hello world' };
    const out = applyFilters(items, s);
    expect(out.map((i) => i.videoId)).toEqual(['a']);
  });

  test('tagMode AND requires all tags', () => {
    const s: FilterState = { ...baseState, selectedTags: new Set(['企画', 'トーク']), tagMode: 'AND' };
    const out = applyFilters(items, s);
    expect(out.map((i) => i.videoId)).toEqual(['a']);
  });

  test('tagMode OR requires any tag', () => {
    const s: FilterState = { ...baseState, selectedTags: new Set(['ゲーム', 'トーク']), tagMode: 'OR' };
    const out = applyFilters(items, s);
    expect(out.map((i) => i.videoId).sort()).toEqual(['a', 'b']);
  });

  test('date range excludes items without dates', () => {
    const s: FilterState = { ...baseState, dateRange: { fromYmd: '2020-01-01', toYmd: '2020-01-01', fromDay: 1, toDay: 1 } };
    const out = applyFilters(items, s);
    expect(out.map((i) => i.videoId)).toEqual(['a']);
  });

  test('duration range works', () => {
    const s: FilterState = { ...baseState, durationRange: { minMinutes: 30, maxMinutes: 90, maxBoundMinutes: 240 } };
    const out = applyFilters(items, s);
    expect(out.map((i) => i.videoId)).toEqual(['b']);
  });

  test('sortOrder asc', () => {
    const s: FilterState = { ...baseState, sortOrder: 'asc' };
    const out = applyFilters(items, s);
    expect(out.map((i) => i.videoId)).toEqual(['c', 'a', 'b']);
  });
});
