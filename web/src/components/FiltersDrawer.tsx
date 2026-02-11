import { useMemo } from 'react';
import type { SortOrder, TagMode } from '../lib/filter';
import { getTagUiGroup, type TagGroupMap } from '../lib/tags';
import { Calendar } from './Calendar';

type TagRow = { tag: string; count: number; groupId: string };

export function FiltersDrawer({
  open,
  onClose,
  totalCount,
  filteredCount,
  yearCounts,
  selectedYear,
  onPickYear,
  // date
  fromYmd,
  toYmd,
  cursorYear,
  cursorMonth0,
  videoDates,
  onChangeCursor,
  onPickDay,
  onSetToday,
  onClearDate,
  // duration
  minMinutes,
  maxMinutes,
  maxBoundMinutes,
  onChangeMinMinutes,
  onChangeMaxMinutes,
  onResetDuration,
  // tags
  tagMode,
  onChangeTagMode,
  sortOrder,
  onChangeSortOrder,
  selectedTags,
  onToggleTag,
  onClearTags,
  tagSearch,
  onChangeTagSearch,
  tagCounts,
  tagGroupMap,
}: {
  open: boolean;
  onClose: () => void;
  totalCount: number;
  filteredCount: number;
  yearCounts: Map<number, number>;
  selectedYear: number | null;
  onPickYear: (year: number) => void;
  fromYmd: string | null;
  toYmd: string | null;
  cursorYear: number;
  cursorMonth0: number;
  videoDates: Set<string>;
  onChangeCursor: (year: number, month0: number) => void;
  onPickDay: (ymd: string) => void;
  onSetToday: () => void;
  onClearDate: () => void;
  minMinutes: number;
  maxMinutes: number;
  maxBoundMinutes: number;
  onChangeMinMinutes: (v: number) => void;
  onChangeMaxMinutes: (v: number) => void;
  onResetDuration: () => void;
  tagMode: TagMode;
  onChangeTagMode: (v: TagMode) => void;
  sortOrder: SortOrder;
  onChangeSortOrder: (v: SortOrder) => void;
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
  tagSearch: string;
  onChangeTagSearch: (v: string) => void;
  tagCounts: Map<string, number>;
  tagGroupMap: TagGroupMap | null;
}) {
  const years = useMemo(() => Array.from(yearCounts.keys()).sort((a, b) => a - b), [yearCounts]);
  const maxYearCount = useMemo(() => Math.max(1, ...Array.from(yearCounts.values())), [yearCounts]);

  const uiGroups = useMemo(() => {
    if (!tagGroupMap) return [];
    return tagGroupMap.ui_groups;
  }, [tagGroupMap]);

  const tagRows = useMemo(() => {
    const q = tagSearch.trim().toLocaleLowerCase();
    const rows: TagRow[] = [];
    for (const [tag, count] of tagCounts.entries()) {
      if (q && !tag.toLocaleLowerCase().includes(q)) continue;
      rows.push({ tag, count, groupId: getTagUiGroup(tag, tagGroupMap) });
    }
    rows.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
    return rows;
  }, [tagCounts, tagSearch, tagGroupMap]);

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

  const selectedTagList = useMemo(() => Array.from(selectedTags).sort((a, b) => a.localeCompare(b, 'ja')), [selectedTags]);

  const dateRangeText = useMemo(() => {
    if (!fromYmd) return '(未指定)';
    if (!toYmd || fromYmd === toYmd) return fromYmd;
    return `${fromYmd} 〜 ${toYmd}`;
  }, [fromYmd, toYmd]);

  const durationLabel = useMemo(() => {
    if (minMinutes === 0 && maxMinutes >= maxBoundMinutes) return '(未指定)';
    return `${minMinutes}分 〜 ${maxMinutes}分`;
  }, [minMinutes, maxMinutes, maxBoundMinutes]);

  if (!open) return null;

  return (
    <>
      <div className="drawerBackdrop open" onClick={onClose} />
      <aside className="drawer open" role="dialog" aria-modal="true" aria-label="Filters Drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerHeader">
          <h2>Filters</h2>
          <button className="btn" type="button" onClick={onClose}>
            閉じる
          </button>
        </div>

        <div className="drawerBody">
          {/* Distribution */}
          <details open>
            <summary>
              <span>Distribution</span>
              <span className="hint">{filteredCount} / {totalCount}</span>
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
                  <div className="v">{selectedTags.size}</div>
                  <div className="s">active</div>
                </div>
                <div className="kpi">
                  <div className="k">Date Range</div>
                  <div className="v">{fromYmd ? (toYmd && fromYmd !== toYmd ? '範囲' : fromYmd.slice(5)) : '—'}</div>
                  <div className="s">JST</div>
                </div>
              </div>

              <div className="hist">
                <div className="histTop">
                  <div className="lbl">年別（クリックで年フィルタ）</div>
                  <div className="mono">{selectedYear ? `year: ${selectedYear}` : 'year: all'}</div>
                </div>
                <div className="bars" role="list" aria-label="年別バー">
                  {years.map((y) => {
                    const c = yearCounts.get(y) ?? 0;
                    const h = Math.max(8, Math.round((c / maxYearCount) * 70));
                    return (
                      <div
                        key={y}
                        className="barItem"
                        data-on={selectedYear === y}
                        style={{ height: `${h}px` }}
                        role="listitem"
                        title={`${y}年 (${c})`}
                        onClick={() => onPickYear(y)}
                      >
                        <span>{y}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>

          {/* Date Range */}
          <details open>
            <summary>
              <span>Date Range</span>
              <span className="hint">1カレンダーで from-to</span>
            </summary>
            <div className="detailsBody">
              <div className="dateTop">
                <div className="datePill">{dateRangeText}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="btn tiny" type="button" onClick={onSetToday}>
                    今日
                  </button>
                  <button className="btn tiny" type="button" onClick={onClearDate}>
                    クリア
                  </button>
                </div>
              </div>

              <Calendar
                cursorYear={cursorYear}
                cursorMonth0={cursorMonth0}
                fromYmd={fromYmd}
                toYmd={toYmd}
                videoDates={videoDates}
                onChangeCursor={onChangeCursor}
                onPickDay={onPickDay}
              />

              <div className="dateHelp">
                クリック順: 開始日 → 終了日（逆順でもOK）。1日だけなら同じ日を2回クリック。配信日が無い動画はレンジ指定時に除外されます。
              </div>
            </div>
          </details>

          {/* Duration */}
          <div className="field" style={{ marginTop: '12px' }}>
            <label>配信時間（分）</label>
            <div className="rangeRow">
              <div className="small">{durationLabel}</div>
              <button className="btn tiny" type="button" onClick={onResetDuration} title="配信時間フィルタを解除">
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
                  value={minMinutes}
                  onChange={(e) => onChangeMinMinutes(Number(e.target.value))}
                />
              </div>
              <div>
                <div className="small">最長</div>
                <input
                  type="range"
                  min={0}
                  max={maxBoundMinutes}
                  step={5}
                  value={maxMinutes}
                  onChange={(e) => onChangeMaxMinutes(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="dateHelp" style={{ marginTop: '6px' }}>
              ※ 0〜最大は「指定なし」扱い。時間指定がある場合のみ、配信時間が取得できない動画は除外されます。
            </div>
          </div>

          {/* Tag Mode */}
          <div className="field">
            <label>タグ絞り込み</label>
            <select value={tagMode} onChange={(e) => onChangeTagMode(e.target.value as TagMode)}>
              <option value="AND">AND（全て含む）</option>
              <option value="OR">OR（どれか含む）</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="field">
            <label>並び順</label>
            <select value={sortOrder} onChange={(e) => onChangeSortOrder(e.target.value as SortOrder)}>
              <option value="desc">投稿日 新しい順</option>
              <option value="asc">投稿日 古い順</option>
            </select>
          </div>

          {/* Tag Search */}
          <div className="field">
            <label>タグ検索（一覧用）</label>
            <input
              type="text"
              placeholder="例: 雑談 / ホラー / コラボ"
              autoComplete="off"
              value={tagSearch}
              onChange={(e) => onChangeTagSearch(e.target.value)}
            />
          </div>

          {/* Selected Tags */}
          <div className="field">
            <label>選択中タグ</label>
            <div className="topChips">
              {selectedTagList.length === 0 && <span className="small">(なし)</span>}
              {selectedTagList.map((t) => (
                <span key={t} className="chip" data-on="true" onClick={() => onToggleTag(t)}>
                  {t} ×
                </span>
              ))}
            </div>
          </div>

          {/* Tag Categories */}
          {uiGroups.map((ug, idx) => (
            <TagCategory
              key={ug.id}
              title={ug.label}
              hint={groups[ug.id]?.length ?? 0}
              rows={groups[ug.id] ?? []}
              selectedTags={selectedTags}
              maxCount={maxTagCount}
              onToggleTag={onToggleTag}
              defaultOpen={idx === 0}
            />
          ))}
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button className="btn" type="button" onClick={onClearTags}>
            タグ解除
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
      <div className="tagList" role="listbox">
        {rows.map((r) => {
          const w = Math.round((r.count / maxCount) * 100);
          const isOn = selectedTags.has(r.tag);
          return (
            <div
              key={r.tag}
              className="tagRow"
              data-on={isOn}
              role="option"
              aria-selected={isOn}
              onClick={() => onToggleTag(r.tag)}
            >
              <div className="tagRowTop">
                <span className="tagName">{r.tag}</span>
                <span className="count">{r.count}</span>
              </div>
              <div className="tagBar">
                <i style={{ width: `${w}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </details>
  );
}
