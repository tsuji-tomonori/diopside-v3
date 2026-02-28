import { useEffect, useMemo, useState } from 'react';
import type { SortOrder, TagMode } from '../lib/filter';
import { getTagUiGroup, type TagGroupMap } from '../lib/tags';
import { Calendar } from './Calendar';

type TagRow = { tag: string; count: number; groupId: string };

export type DrawerFilterDraft = {
  fromYmd: string | null;
  toYmd: string | null;
  selectedYear: number | null;
  cursorYear: number;
  cursorMonth0: number;
  minMinutes: number;
  maxMinutes: number;
  tagMode: TagMode;
  sortOrder: SortOrder;
  selectedTags: Set<string>;
  tagSearch: string;
};

export function FiltersDrawer({
  open,
  onClose,
  totalCount,
  filteredCount,
  yearCounts,
  videoDates,
  maxBoundMinutes,
  tagCounts,
  tagGroupMap,
  initialDraft,
  onApply,
  onClearAll,
}: {
  open: boolean;
  onClose: () => void;
  totalCount: number;
  filteredCount: number;
  yearCounts: Map<number, number>;
  videoDates: Set<string>;
  maxBoundMinutes: number;
  tagCounts: Map<string, number>;
  tagGroupMap: TagGroupMap | null;
  initialDraft: DrawerFilterDraft;
  onApply: (draft: DrawerFilterDraft) => void;
  onClearAll: () => void;
}) {
  const [draft, setDraft] = useState<DrawerFilterDraft>(initialDraft);

  useEffect(() => {
    if (open) {
      setDraft(initialDraft);
    }
  }, [open, initialDraft]);

  const years = useMemo(() => Array.from(yearCounts.keys()).sort((a, b) => a - b), [yearCounts]);
  const maxYearCount = useMemo(() => Math.max(1, ...Array.from(yearCounts.values())), [yearCounts]);

  const uiGroups = useMemo(() => {
    if (!tagGroupMap) return [];
    return tagGroupMap.ui_groups;
  }, [tagGroupMap]);

  const tagRows = useMemo(() => {
    const q = draft.tagSearch.trim().toLocaleLowerCase();
    const rows: TagRow[] = [];
    for (const [tag, count] of tagCounts.entries()) {
      if (q && !tag.toLocaleLowerCase().includes(q)) continue;
      rows.push({ tag, count, groupId: getTagUiGroup(tag, tagGroupMap) });
    }
    rows.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
    return rows;
  }, [draft.tagSearch, tagCounts, tagGroupMap]);

  const groups = useMemo(() => {
    const g: Record<string, TagRow[]> = {};
    for (const ug of uiGroups) {
      g[ug.id] = [];
    }
    for (const r of tagRows) {
      if (!g[r.groupId]) g[r.groupId] = [];
      g[r.groupId].push(r);
    }
    return g;
  }, [tagRows, uiGroups]);

  const maxTagCount = useMemo(() => Math.max(1, ...tagRows.map((r) => r.count)), [tagRows]);

  const selectedTagList = useMemo(() => Array.from(draft.selectedTags).sort((a, b) => a.localeCompare(b, 'ja')), [draft.selectedTags]);

  const dateRangeText = useMemo(() => {
    if (!draft.fromYmd) return '(未指定)';
    if (!draft.toYmd || draft.fromYmd === draft.toYmd) return draft.fromYmd;
    return `${draft.fromYmd} 〜 ${draft.toYmd}`;
  }, [draft.fromYmd, draft.toYmd]);

  const durationLabel = useMemo(() => {
    if (draft.minMinutes === 0 && draft.maxMinutes >= maxBoundMinutes) return '(未指定)';
    return `${draft.minMinutes}分 〜 ${draft.maxMinutes}分`;
  }, [draft.minMinutes, draft.maxMinutes, maxBoundMinutes]);

  const updateSet = (tag: string) => {
    setDraft((prev) => {
      const nextTags = new Set(prev.selectedTags);
      if (nextTags.has(tag)) nextTags.delete(tag);
      else nextTags.add(tag);
      return { ...prev, selectedTags: nextTags };
    });
  };

  const clearTags = () => {
    setDraft((prev) => ({ ...prev, selectedTags: new Set() }));
  };

  const clearDate = () => {
    setDraft((prev) => ({ ...prev, fromYmd: null, toYmd: null, selectedYear: null }));
  };

  const setToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const ymd = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setDraft((prev) => ({
      ...prev,
      fromYmd: ymd,
      toYmd: ymd,
      selectedYear: null,
      cursorYear: y,
      cursorMonth0: m - 1,
    }));
  };

  const pickDay = (ymd: string) => {
    setDraft((prev) => {
      if (!prev.fromYmd || prev.toYmd) {
        return { ...prev, fromYmd: ymd, toYmd: null, selectedYear: null };
      }
      if (ymd <= prev.fromYmd) {
        return { ...prev, fromYmd: ymd, toYmd: prev.fromYmd, selectedYear: null };
      }
      return { ...prev, toYmd: ymd, selectedYear: null };
    });
  };

  const pickYear = (year: number) => {
    setDraft((prev) => ({
      ...prev,
      selectedYear: year,
      fromYmd: `${year}-01-01`,
      toYmd: `${year}-12-31`,
      cursorYear: year,
      cursorMonth0: 0,
    }));
  };

  if (!open) return null;

  return (
    <>
      <div className="drawerBackdrop open" onClick={onClose} />
      <aside id="filters-drawer" className="drawer open" role="dialog" aria-modal="true" aria-label="Filters Drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <h2>Filters</h2>
          <button className="btn" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>

        <div className="drawerBody">
          <details open>
            <summary>
              <span>Distribution</span>
              <span className="hint">
                {filteredCount} / {totalCount}
              </span>
            </summary>
            <div className="detailsBody">
              <div className="kpis">
                <div className="kpi">
                  <div className="k">Total</div>
                  <div className="v">{totalCount}</div>
                  <div className="s">videos</div>
                </div>
                <div className="kpi">
                  <div className="k">Filtered</div>
                  <div className="v">{filteredCount}</div>
                  <div className="s">in view</div>
                </div>
                <div className="kpi">
                  <div className="k">Selected Tags</div>
                  <div className="v">{draft.selectedTags.size}</div>
                  <div className="s">active</div>
                </div>
                <div className="kpi">
                  <div className="k">Date Range</div>
                  <div className="v">{draft.fromYmd ? (draft.toYmd && draft.fromYmd !== draft.toYmd ? '範囲' : draft.fromYmd.slice(5)) : '—'}</div>
                  <div className="s">JST</div>
                </div>
              </div>

              <div className="hist">
                <div className="histTop">
                  <div className="lbl">年別（クリックで年フィルタ）</div>
                  <div className="mono">{draft.selectedYear ? `year: ${draft.selectedYear}` : 'year: all'}</div>
                </div>
                <div className="bars" role="list" aria-label="年別バー">
                  {years.map((y) => {
                    const c = yearCounts.get(y) ?? 0;
                    const h = Math.max(8, Math.round((c / maxYearCount) * 70));
                    return (
                      <button
                        key={y}
                        className="barItem"
                        data-on={draft.selectedYear === y}
                        style={{ height: `${h}px` }}
                        role="listitem"
                        title={`${y}年 (${c})`}
                        onClick={() => pickYear(y)}
                        type="button"
                      >
                        <span>{y}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>

          <details open>
            <summary>
              <span>Date Range</span>
              <span className="hint">1カレンダーで from-to</span>
            </summary>
            <div className="detailsBody">
              <div className="dateTop">
                <div className="datePill">{dateRangeText}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn tiny" type="button" onClick={setToday}>
                    今日
                  </button>
                  <button className="btn tiny" type="button" onClick={clearDate}>
                    クリア
                  </button>
                </div>
              </div>

              <Calendar
                cursorYear={draft.cursorYear}
                cursorMonth0={draft.cursorMonth0}
                fromYmd={draft.fromYmd}
                toYmd={draft.toYmd}
                videoDates={videoDates}
                onChangeCursor={(year, month0) => setDraft((prev) => ({ ...prev, cursorYear: year, cursorMonth0: month0 }))}
                onPickDay={pickDay}
              />

              <div className="dateHelp">
                クリック順: 開始日 → 終了日（逆順でもOK）。1日だけなら同じ日を2回クリック。配信日が無い動画はレンジ指定時に除外されます。
              </div>
            </div>
          </details>

          <div className="field" style={{ marginTop: '12px' }}>
            <label>配信時間（分）</label>
            <div className="rangeRow">
              <div className="small">{durationLabel}</div>
              <button
                className="btn tiny"
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, minMinutes: 0, maxMinutes: maxBoundMinutes }))}
                title="配信時間フィルタを解除"
              >
                クリア
              </button>
            </div>
            <div className="rangeGrid">
              <div>
                <div className="small">最短</div>
                <input
                  type="range"
                  min={0}
                  max={maxBoundMinutes}
                  step={5}
                  value={draft.minMinutes}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDraft((prev) => ({ ...prev, minMinutes: Math.min(v, prev.maxMinutes) }));
                  }}
                />
              </div>
              <div>
                <div className="small">最長</div>
                <input
                  type="range"
                  min={0}
                  max={maxBoundMinutes}
                  step={5}
                  value={draft.maxMinutes}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDraft((prev) => ({ ...prev, maxMinutes: Math.max(v, prev.minMinutes) }));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="field">
            <label>タグ絞り込み</label>
            <select value={draft.tagMode} onChange={(e) => setDraft((prev) => ({ ...prev, tagMode: e.target.value as TagMode }))}>
              <option value="AND">AND（全て含む）</option>
              <option value="OR">OR（どれか含む）</option>
            </select>
          </div>

          <div className="field">
            <label>並び順</label>
            <select value={draft.sortOrder} onChange={(e) => setDraft((prev) => ({ ...prev, sortOrder: e.target.value as SortOrder }))}>
              <option value="desc">投稿日 新しい順</option>
              <option value="asc">投稿日 古い順</option>
            </select>
          </div>

          <div className="field">
            <label>タグ検索（一覧用）</label>
            <input
              type="text"
              placeholder="例: 雑談 / ホラー / コラボ"
              autoComplete="off"
              value={draft.tagSearch}
              onChange={(e) => setDraft((prev) => ({ ...prev, tagSearch: e.target.value }))}
            />
          </div>

          <div className="field">
            <label>選択中タグ</label>
            <div className="topChips">
              {selectedTagList.length === 0 && <span className="small">(なし)</span>}
              {selectedTagList.map((t) => (
                <button key={t} className="chip" data-on="true" onClick={() => updateSet(t)} type="button">
                  {t} ×
                </button>
              ))}
            </div>
          </div>

          {uiGroups.map((ug, idx) => (
            <TagCategory
              key={ug.id}
              title={ug.label}
              hint={groups[ug.id]?.length ?? 0}
              rows={groups[ug.id] ?? []}
              selectedTags={draft.selectedTags}
              maxCount={maxTagCount}
              onToggleTag={updateSet}
              defaultOpen={idx === 0}
            />
          ))}
        </div>

        <div className="drawerFooter">
          <button className="btn" type="button" onClick={clearTags}>
            タグ解除
          </button>
          <button className="btn" type="button" onClick={onClearAll}>
            全クリア
          </button>
          <button
            className="btn primary"
            type="button"
            onClick={() => {
              onApply({ ...draft, selectedTags: new Set(draft.selectedTags) });
              onClose();
            }}
          >
            適用
          </button>
        </div>
      </aside>
    </>
  );
}

function TagCategory({
  title,
  hint,
  rows,
  selectedTags,
  maxCount,
  onToggleTag,
  defaultOpen = false,
}: {
  title: string;
  hint: number;
  rows: TagRow[];
  selectedTags: Set<string>;
  maxCount: number;
  onToggleTag: (tag: string) => void;
  defaultOpen?: boolean;
}) {
  return (
    <details className="tagCategory" open={defaultOpen}>
      <summary>
        {title} <span className="hint">{hint}</span>
      </summary>
      <div className="tagList" role="listbox" aria-label={`${title}タグ`}>
        {rows.map((r) => {
          const w = Math.round((r.count / maxCount) * 100);
          const isOn = selectedTags.has(r.tag);
          return (
            <button
              key={r.tag}
              className="tagRow"
              data-on={isOn}
              role="option"
              aria-selected={isOn}
              onClick={() => onToggleTag(r.tag)}
              type="button"
            >
              <div className="tagRowTop">
                <span className="tagName">{r.tag}</span>
                <span className="count">{r.count}</span>
              </div>
              <div className="tagBar">
                <i style={{ width: `${w}%` }} />
              </div>
            </button>
          );
        })}
      </div>
    </details>
  );
}
