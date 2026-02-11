import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { VideoItem } from '../lib/data';
import { useClickOutside } from '../hooks/useClickOutside';

type TagSuggestion = { type: 'tag'; value: string; count: number };
type TitleSuggestion = { type: 'title'; value: string; videoId: string };
export type Suggestion = TagSuggestion | TitleSuggestion;

function buildSuggestions(query: string, tagCounts: Map<string, number>, items: VideoItem[]): Suggestion[] {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return [];

  const tagMatches: TagSuggestion[] = [];
  for (const [tag, count] of tagCounts.entries()) {
    if (tag.toLocaleLowerCase().includes(q)) {
      tagMatches.push({ type: 'tag', value: tag, count });
    }
  }
  tagMatches.sort((a, b) => b.count - a.count);

  const titleMatches: TitleSuggestion[] = [];
  for (const it of items) {
    if (!it.title) continue;
    if (it.title.toLocaleLowerCase().includes(q)) {
      titleMatches.push({ type: 'title', value: it.title, videoId: it.videoId });
    }
    if (titleMatches.length >= 5) break;
  }

  return [...tagMatches.slice(0, 8), ...titleMatches];
}

export function SearchBar({
  query,
  onChangeQuery,
  pillText,
  tagCounts,
  items,
  onPickTag,
}: {
  query: string;
  onChangeQuery: (v: string) => void;
  pillText: string;
  tagCounts: Map<string, number>;
  items: VideoItem[];
  onPickTag: (tag: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);

  const suggestions = useMemo(() => buildSuggestions(query, tagCounts, items), [query, tagCounts, items]);
  const isOpen = open && suggestions.length > 0;

  const close = useCallback(() => {
    setActiveIndex(-1);
    setOpen(false);
  }, []);

  useClickOutside(wrapRef, close, isOpen);

  const selectSuggestion = useCallback(
    (s: Suggestion) => {
      if (s.type === 'tag') {
        onPickTag(s.value);
        onChangeQuery('');
      } else {
        onChangeQuery(s.value);
      }
      close();
    },
    [onPickTag, onChangeQuery, close],
  );

  return (
    <div className="search-wrap" ref={wrapRef}>
      <div className="search">
        <span aria-hidden="true">🔎</span>
        <input
          id="q"
          type="search"
          placeholder="検索: タイトル / タグ / ID（スペース=AND）"
          autoComplete="off"
          value={query}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onChange={(e) => {
            const v = e.target.value;
            onChangeQuery(v);
            setActiveIndex(-1);
            setOpen(v.trim().length > 0);
          }}
          onKeyDown={(e) => {
            if (!isOpen) {
              if (e.key === 'Escape') close();
              return;
            }

            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, -1));
            } else if (e.key === 'Enter' && activeIndex >= 0) {
              e.preventDefault();
              selectSuggestion(suggestions[activeIndex]);
            } else if (e.key === 'Escape') {
              close();
            }
          }}
          aria-autocomplete="list"
          aria-controls="suggestions"
          aria-expanded={isOpen}
        />
        <span id="pill" className="pill">
          {pillText}
        </span>
      </div>

      <ul id="suggestions" className={`suggestions ${isOpen ? 'open' : ''}`} role="listbox">
        {isOpen &&
          suggestions.map((s, idx) => (
            <li
              key={`${s.type}-${s.value}-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              className={idx === activeIndex ? 'active' : ''}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseDown={(e) => {
                // Prevent input blur before onClick
                e.preventDefault();
              }}
              onClick={() => selectSuggestion(s)}
            >
              <span className={`sug-type ${s.type}`}>{s.type === 'tag' ? 'タグ' : 'タイトル'}</span>
              <span>{s.value}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
