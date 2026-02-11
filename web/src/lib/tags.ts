// Types for tag_group_map.json
export type UiGroup = {
  id: string;
  label: string;
};

export type TagInfo = {
  tag_type: string;
  ui_group: string;
  video_count: number;
  description?: string;
  tagging_policy?: string;
};

export type TagGroupMap = {
  generated_at: string;
  ui_groups: UiGroup[];
  tag_type_to_ui_group: Record<string, string>;
  tags: Record<string, TagInfo>;
};

// Default fallback group ID
const FALLBACK_GROUP_ID = 'その他';

/**
 * Get the UI group for a given tag from the tag group map.
 * Returns the fallback group if tag is not found.
 */
export function getTagUiGroup(tag: string, tagGroupMap: TagGroupMap | null): string {
  if (!tagGroupMap) return FALLBACK_GROUP_ID;
  const info = tagGroupMap.tags[tag];
  return info?.ui_group ?? FALLBACK_GROUP_ID;
}

export function uniqueSorted(tags: string[], locale: string = 'ja'): string[] {
  return Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b, locale));
}

export function countTags(items: Array<{ tags: string[] }>): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    for (const t of it.tags) {
      m.set(t, (m.get(t) ?? 0) + 1);
    }
  }
  return m;
}

export function countYears(items: Array<{ year: number | null }>): Map<number, number> {
  const m = new Map<number, number>();
  for (const it of items) {
    if (it.year == null) continue;
    m.set(it.year, (m.get(it.year) ?? 0) + 1);
  }
  return m;
}
