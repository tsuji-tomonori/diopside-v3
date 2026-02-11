import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import type { VideoItem, BootstrapJson, TagMasterJson, ArchiveIndexPageJson } from './lib/data';
import {
  loadJsonFromPublic,
  mergeRecords,
  StagedDataLoader,
  parseArchivePageItems,
  buildTagMasterMap,
  calculateDurationMaxBound,
} from './lib/data';
import { applyFilters, type DateRange, type FilterState, type SortOrder, type TagMode } from './lib/filter';
import { countTags, countYears, type TagGroupMap } from './lib/tags';
import { getTodayYmdJst, ymdToDayNumJst } from './lib/date';
import { SearchBar } from './components/SearchBar';
import { SelectedTags } from './components/SelectedTags';
import { VideoGrid } from './components/VideoGrid';
import { FiltersDrawer } from './components/FiltersDrawer';
import { VideoModal } from './components/VideoModal';
import { Toast } from './components/Toast';
import { useToast } from './hooks/useToast';

type LoadPhase = 'idle' | 'bootstrap' | 'legacy' | 'tag_master' | 'archive' | 'complete';

/**
 * Convert TagMasterJson to TagGroupMap format for filter UI compatibility.
 */
function buildTagGroupMapFromMaster(tagMaster: TagMasterJson): TagGroupMap {
  const uiGroups: TagGroupMap['ui_groups'] = tagMaster.tagTypes.map((tt) => ({
    id: tt.key,
    label: `${tt.name}から選ぶ`,
  }));

  const tagTypeToUiGroup: Record<string, string> = {};
  for (const tt of tagMaster.tagTypes) {
    tagTypeToUiGroup[tt.key] = tt.key;
  }

  const tags: Record<string, TagGroupMap['tags'][string]> = {};
  for (let i = 0; i < tagMaster.tags.length; i++) {
    const entry = tagMaster.tags[i];
    const [tagTypeId, tagName] = entry;
    const tagType = tagMaster.tagTypes.find((tt) => tt.id === tagTypeId);
    const tagTypeKey = tagType?.key ?? 'その他';

    tags[tagName] = {
      tag_type: tagTypeKey,
      ui_group: tagTypeKey,
      video_count: 0, // Not available in tag_master
    };
  }

  return {
    generated_at: tagMaster.generatedAt,
    ui_groups: uiGroups,
    tag_type_to_ui_group: tagTypeToUiGroup,
    tags,
  };
}

const DEFAULT_LIMIT = 220;

export function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadPhase, setLoadPhase] = useState<LoadPhase>('idle');
  const [error, setError] = useState<string | null>(null);

  const [items, setItems] = useState<VideoItem[]>([]);
  const [durationMaxBoundMinutes, setDurationMaxBoundMinutes] = useState<number>(240);
  const [tagGroupMap, setTagGroupMap] = useState<TagGroupMap | null>(null);

  // New schema state
  const [tagMasterLoaded, setTagMasterLoaded] = useState<boolean>(false);
  const [archiveTotal, setArchiveTotal] = useState<number>(0);
  const [archiveLoaded, setArchiveLoaded] = useState<number>(0);
  const tagLookupRef = useRef<Map<number, string>>(new Map());
  const loaderRef = useRef<StagedDataLoader | null>(null);

  // filters
  const [q, setQ] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [tagMode, setTagMode] = useState<TagMode>('AND');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [fromYmd, setFromYmd] = useState<string | null>(null);
  const [toYmd, setToYmd] = useState<string | null>(null);

  const [cursorYear, setCursorYear] = useState<number>(() => Number(getTodayYmdJst().slice(0, 4)));
  const [cursorMonth0, setCursorMonth0] = useState<number>(() => Number(getTodayYmdJst().slice(5, 7)) - 1);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const [minMinutes, setMinMinutes] = useState<number>(0);
  const [maxMinutes, setMaxMinutes] = useState<number>(240);

  const [tagSearch, setTagSearch] = useState<string>('');

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);

  const [modalId, setModalId] = useState<string | null>(null);

  const [showTop, setShowTop] = useState<boolean>(false);

  const { state: toastState, toast } = useToast(1300);

  // Load data - supports both new staged format and legacy format
  useEffect(() => {
    let cancelled = false;

    async function tryLoadBootstrap(base: string): Promise<boolean> {
      try {
        const res = await fetch(`${base}bootstrap.json`, { method: 'HEAD' });
        return res.ok;
      } catch {
        return false;
      }
    }

    async function loadLegacyFormat(base: string) {
      setLoadPhase('legacy');
      const [tagging, summary, tagMap] = await Promise.all([
        loadJsonFromPublic<unknown[]>(`${base}tagging_results.json`),
        loadJsonFromPublic<unknown[]>(`${base}summary.json`),
        loadJsonFromPublic<TagGroupMap>(`${base}tag_group_map.json`),
      ]);

      const merged = mergeRecords(tagging, summary);
      if (cancelled) return;

      setItems(merged.items);
      setDurationMaxBoundMinutes(merged.durationMaxBoundMinutes);
      setMaxMinutes(merged.durationMaxBoundMinutes);
      setTagGroupMap(tagMap);
      setLoadPhase('complete');
    }

    async function loadStagedFormat(base: string) {
      const loader = new StagedDataLoader(base);
      loaderRef.current = loader;

      // Phase 1: Load bootstrap for immediate rendering
      setLoadPhase('bootstrap');
      const { items: bootstrapItems, bootstrap } = await loader.loadBootstrap();
      if (cancelled) return;

      setItems(bootstrapItems);
      setDurationMaxBoundMinutes(calculateDurationMaxBound(bootstrapItems));
      setMaxMinutes(calculateDurationMaxBound(bootstrapItems));
      tagLookupRef.current = loader.getTagLookup();
      setLoading(false); // Show initial content immediately

      // Phase 2: Load tag master in background
      setLoadPhase('tag_master');
      const tagMaster = await loader.loadTagMaster();
      if (cancelled) return;

      tagLookupRef.current = buildTagMasterMap(tagMaster.tags);
      setTagMasterLoaded(true);

      // Build tagGroupMap from tag_master for filter UI
      const tagMap = buildTagGroupMapFromMaster(tagMaster);
      setTagGroupMap(tagMap);

      // Phase 3: Load archive pages incrementally
      setLoadPhase('archive');
      const pageSize = bootstrap.next.archiveIndex.pageSize;
      let page = 0;
      let allItems: VideoItem[] = [];
      let totalItems = 0;

      while (!cancelled) {
        try {
          const { items: pageItems, page: pageData } = await loader.loadArchivePage(page);
          if (cancelled) return;

          if (page === 0) {
            totalItems = pageData.total;
            setArchiveTotal(Math.ceil(totalItems / pageSize));
          }

          allItems = [...allItems, ...pageItems];
          setArchiveLoaded(page + 1);

          // Update items with full archive data (sorted by date desc)
          const sorted = allItems.slice().sort((a, b) => b.dateNum - a.dateNum);
          setItems(sorted);
          setDurationMaxBoundMinutes(calculateDurationMaxBound(sorted));
          setMaxMinutes(calculateDurationMaxBound(sorted));

          // Check if we've loaded all pages
          if (allItems.length >= totalItems || pageItems.length === 0) {
            break;
          }
          page++;
        } catch (e) {
          // No more pages or error
          break;
        }
      }

      if (!cancelled) {
        setLoadPhase('complete');
      }
    }

    async function run() {
      setLoading(true);
      setError(null);
      setLoadPhase('idle');

      try {
        const base = import.meta.env.BASE_URL || '/';

        // Check if new format is available
        const hasBootstrap = await tryLoadBootstrap(base);

        if (hasBootstrap) {
          await loadStagedFormat(base);
        } else {
          await loadLegacyFormat(base);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
        setLoadPhase('idle');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll-to-top button
  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 700);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dateRange: DateRange = useMemo(
    () => ({
      fromYmd,
      toYmd,
      fromDay: fromYmd ? ymdToDayNumJst(fromYmd) : null,
      toDay: toYmd ? ymdToDayNumJst(toYmd) : null,
    }),
    [fromYmd, toYmd],
  );

  const filterState: FilterState = useMemo(
    () => ({
      q,
      selectedTags,
      tagMode,
      sortOrder,
      dateRange,
      durationRange: {
        minMinutes,
        maxMinutes,
        maxBoundMinutes: durationMaxBoundMinutes,
      },
    }),
    [q, selectedTags, tagMode, sortOrder, dateRange, minMinutes, maxMinutes, durationMaxBoundMinutes],
  );

  const filteredItems = useMemo(() => applyFilters(items, filterState), [items, filterState]);

  const hasMore = filteredItems.length > limit;
  const visibleItems = useMemo(() => filteredItems.slice(0, limit), [filteredItems, limit]);

  const pillText = `${filteredItems.length} / ${items.length}`;

  const videoDates = useMemo(() => new Set(items.map((it) => it.ymd).filter(Boolean)), [items]);

  const isDateActive = fromYmd != null || toYmd != null;
  const isDurationActive = minMinutes > 0 || maxMinutes < durationMaxBoundMinutes;
  const isQueryActive = q.trim().length > 0;

  const tagCounts = useMemo(() => {
    const useFilteredForFacet = tagMode === 'AND' && (selectedTags.size > 0 || isDateActive || isDurationActive || isQueryActive);
    return countTags(useFilteredForFacet ? filteredItems : items);
  }, [items, filteredItems, tagMode, selectedTags.size, isDateActive, isDurationActive, isQueryActive]);

  const yearCounts = useMemo(() => {
    const base = filteredItems.length > 0 ? filteredItems : items;
    return countYears(base);
  }, [items, filteredItems]);

  // Reset pagination when filters change
  useEffect(() => {
    setLimit(DEFAULT_LIMIT);
  }, [q, selectedTags, tagMode, sortOrder, fromYmd, toYmd, minMinutes, maxMinutes]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const pickTag = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        if (prev.has(tag)) return prev;
        const next = new Set(prev);
        next.add(tag);
        return next;
      });
    },
    [],
  );

  const clearAll = useCallback(() => {
    setQ('');
    setSelectedTags(new Set());
    setTagMode('AND');
    setSortOrder('desc');
    setFromYmd(null);
    setToYmd(null);
    setSelectedYear(null);
    setMinMinutes(0);
    setMaxMinutes(durationMaxBoundMinutes);
    setTagSearch('');
    toast('クリアしました');
  }, [durationMaxBoundMinutes, toast]);

  const clearTags = useCallback(() => {
    setSelectedTags(new Set());
  }, []);

  const clearDate = useCallback(() => {
    setFromYmd(null);
    setToYmd(null);
    setSelectedYear(null);
  }, []);

  const setToday = useCallback(() => {
    const t = getTodayYmdJst();
    setFromYmd(t);
    setToYmd(t);
    setSelectedYear(null);

    setCursorYear(Number(t.slice(0, 4)));
    setCursorMonth0(Number(t.slice(5, 7)) - 1);
  }, []);

  const pickDay = useCallback(
    (ymd: string) => {
      setSelectedYear(null);
      setFromYmd((from) => {
        // If no start date yet, or range already completed, start a new selection.
        if (!from || toYmd) {
          setToYmd(null);
          return ymd;
        }

        // Completing range
        const a = ymd;
        const b = from;
        if (a <= b) {
          setToYmd(b);
          return a;
        } else {
          setToYmd(a);
          return b;
        }
      });
    },
    [toYmd],
  );

  const pickYear = useCallback((year: number) => {
    setSelectedYear(year);
    const f = `${year}-01-01`;
    const t = `${year}-12-31`;
    setFromYmd(f);
    setToYmd(t);
    setCursorYear(year);
    setCursorMonth0(0);
  }, []);

  const resetDuration = useCallback(() => {
    setMinMinutes(0);
    setMaxMinutes(durationMaxBoundMinutes);
  }, [durationMaxBoundMinutes]);

  // Duration slider constraints
  const changeMinMinutes = useCallback(
    (v: number) => {
      setMinMinutes((prevMin) => {
        const nextMin = Math.min(v, maxMinutes);
        return nextMin;
      });
    },
    [maxMinutes],
  );

  const changeMaxMinutes = useCallback(
    (v: number) => {
      setMaxMinutes((prevMax) => {
        const nextMax = Math.max(v, minMinutes);
        return nextMax;
      });
    },
    [minMinutes],
  );

  const selectedTagList = useMemo(() => Array.from(selectedTags).sort((a, b) => a.localeCompare(b, 'ja')), [selectedTags]);

  const modalItem = useMemo(() => (modalId ? items.find((it) => it.videoId === modalId) ?? null : null), [modalId, items]);

  return (
    <div className="app">
      <header>
        <div className="bar">
          <div className="brand">
            <div className="mark" aria-hidden="true"></div>
            <div className="brandTxt">
              <h1>アーカイブタグ検索</h1>
              <p>タグ・日付・キーワードでアーカイブ動画を検索できます。</p>
            </div>
          </div>

          <SearchBar query={q} onChangeQuery={setQ} pillText={pillText} tagCounts={tagCounts} items={items} onPickTag={pickTag} />

          <div className="actions">
            <button className="btn" type="button" onClick={() => setDrawerOpen(true)}>
              Filters
            </button>
            <button className="btn" type="button" onClick={clearAll}>
              クリア
            </button>
            <button className={`btn ${sortOrder === 'desc' ? 'active' : ''}`} type="button" onClick={() => setSortOrder('desc')}>
              ↓ 新しい順
            </button>
            <button className={`btn ${sortOrder === 'asc' ? 'active' : ''}`} type="button" onClick={() => setSortOrder('asc')}>
              ↑ 古い順
            </button>
          </div>
        </div>
      </header>

      <main>
        {loading && <div className="empty">読み込み中...</div>}
        {error && (
          <div className="empty" style={{ color: 'crimson' }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <SelectedTags tags={selectedTagList} onToggle={toggleTag} />

            <VideoGrid
              items={visibleItems}
              onOpen={(id) => setModalId(id)}
              onToggleTag={toggleTag}
              selectedTags={selectedTags}
              hasMore={hasMore}
              onLoadMore={() => setLimit((l) => l + 240)}
            />
          </>
        )}
      </main>

      <button
        id="scrollTopBtn"
        className={`scrollTop ${showTop ? 'visible' : ''}`}
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="ページ上部へ戻る"
      >
        ↑
      </button>

      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        totalCount={items.length}
        filteredCount={filteredItems.length}
        yearCounts={yearCounts}
        selectedYear={selectedYear}
        onPickYear={(y) => {
          pickYear(y);
          toast(`${y}年に絞り込み`);
        }}
        fromYmd={fromYmd}
        toYmd={toYmd}
        cursorYear={cursorYear}
        cursorMonth0={cursorMonth0}
        videoDates={videoDates}
        onChangeCursor={(y, m0) => {
          setCursorYear(y);
          setCursorMonth0(m0);
        }}
        onPickDay={(ymd) => {
          pickDay(ymd);
          toast(`日付: ${ymd}`);
        }}
        onSetToday={setToday}
        onClearDate={clearDate}
        minMinutes={minMinutes}
        maxMinutes={maxMinutes}
        maxBoundMinutes={durationMaxBoundMinutes}
        onChangeMinMinutes={changeMinMinutes}
        onChangeMaxMinutes={changeMaxMinutes}
        onResetDuration={resetDuration}
        tagMode={tagMode}
        onChangeTagMode={(v) => {
          setTagMode(v);
          toast(`タグ条件: ${v}`);
        }}
        sortOrder={sortOrder}
        onChangeSortOrder={(v) => {
          setSortOrder(v);
          toast(`並び: ${v}`);
        }}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        tagSearch={tagSearch}
        onChangeTagSearch={setTagSearch}
        tagCounts={tagCounts}
        tagGroupMap={tagGroupMap}
      />

      <VideoModal
        item={modalItem}
        onClose={() => setModalId(null)}
        onToggleTag={toggleTag}
        selectedTags={selectedTags}
        toast={toast}
      />

      <Toast message={toastState.message} />
    </div>
  );
}
