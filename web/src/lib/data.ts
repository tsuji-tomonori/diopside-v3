import { parseMaybeJsonOrJsonl } from './json';
import { toYmdJst, ymdToDayNumJst, epochSecToYmdJst, epochSecToIso } from './date';
import { parseIsoDurationToSeconds } from './duration';
import { uniqueSorted } from './tags';
import type {
  BootstrapJson,
  TagMasterJson,
  ArchiveIndexPageJson,
  LatestItemTuple,
  ArchiveItemTuple,
  TagPreviewTuple,
  DecodedTag,
} from './schema';

export type TaggingRecord = {
  video_id: string;
  tags?: unknown;
  duration?: string | null;
};

export type SummaryRecord = {
  video_id: string;
  title?: string;
  description?: string;
  published_at?: string;
  duration?: string | null;
};

export type VideoItem = {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  durationIso: string | null;
  // computed
  ymd: string;
  dayNum: number | null;
  year: number | null;
  dateNum: number; // for sorting
  durationSec: number | null;
  searchText: string;
};

// Re-export schema types for external use
export type { BootstrapJson, TagMasterJson, ArchiveIndexPageJson, DecodedTag };

function normalizeTagging(raw: unknown[]): Array<{ videoId: string; tags: string[]; durationIso: string | null }> {
  const out: Array<{ videoId: string; tags: string[]; durationIso: string | null }> = [];
  for (const o of raw) {
    if (!o || typeof o !== 'object') continue;
    const anyO = o as Record<string, unknown>;
    const id = String(anyO.video_id ?? '').trim();
    if (!id) continue;

    const tags = Array.isArray(anyO.tags) ? (anyO.tags as unknown[]).map((t) => String(t).trim()).filter(Boolean) : [];
    const durationIso = typeof anyO.duration === 'string' && anyO.duration.trim() ? String(anyO.duration).trim() : null;

    out.push({ videoId: id, tags, durationIso });
  }
  return out;
}

function normalizeSummary(raw: unknown[]): Array<{ videoId: string; title: string; description: string; publishedAt: string; durationIso: string | null }> {
  const out: Array<{ videoId: string; title: string; description: string; publishedAt: string; durationIso: string | null }> = [];
  for (const o of raw) {
    if (!o || typeof o !== 'object') continue;
    const anyO = o as Record<string, unknown>;
    const id = String(anyO.video_id ?? '').trim();
    if (!id) continue;

    const title = String(anyO.title ?? '').trim();
    const description = String(anyO.description ?? '').trim();
    const publishedAt = String(anyO.published_at ?? '').trim();
    const durationIso = typeof anyO.duration === 'string' && anyO.duration.trim() ? String(anyO.duration).trim() : null;

    out.push({ videoId: id, title, description, publishedAt, durationIso });
  }
  return out;
}

export async function loadJsonFromPublic<T = unknown>(path: string): Promise<T> {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const text = await res.text();
  return parseMaybeJsonOrJsonl<T>(text);
}

export type MergeResult = {
  items: VideoItem[];
  durationMaxBoundMinutes: number;
};

export function mergeRecords(tagging: unknown[], summary: unknown[]): MergeResult {
  const tagRows = normalizeTagging(tagging);
  const sumRows = normalizeSummary(summary);

  type Partial = {
    videoId: string;
    title?: string;
    description?: string;
    publishedAt?: string;
    tags: string[];
    durationIso: string | null;
  };

  const byId = new Map<string, Partial>();

  for (const r of tagRows) {
    const cur = byId.get(r.videoId) ?? { videoId: r.videoId, tags: [], durationIso: null };
    cur.tags = uniqueSorted([...cur.tags, ...r.tags]);
    if (r.durationIso) cur.durationIso = r.durationIso;
    byId.set(r.videoId, cur);
  }

  for (const r of sumRows) {
    const cur = byId.get(r.videoId) ?? { videoId: r.videoId, tags: [], durationIso: null };
    if (r.title) cur.title = r.title;
    if (r.description) cur.description = r.description;
    if (r.publishedAt) cur.publishedAt = r.publishedAt;
    if (r.durationIso && !cur.durationIso) cur.durationIso = r.durationIso;
    byId.set(r.videoId, cur);
  }

  const items: VideoItem[] = [];
  for (const cur of byId.values()) {
    const publishedAt = cur.publishedAt ?? '';
    const ymd = publishedAt ? toYmdJst(publishedAt) : '';
    const dayNum = ymd ? ymdToDayNumJst(ymd) : null;
    const year = ymd ? Number(ymd.slice(0, 4)) : null;
    const dateNum = dayNum ?? Number.NEGATIVE_INFINITY;
    const title = cur.title ?? '';
    const description = cur.description ?? '';
    const durationIso = cur.durationIso ?? null;
    const durationSec = parseIsoDurationToSeconds(durationIso);

    // Precompute a lowercase searchable string for performance.
    const searchText = `${title} ${cur.videoId} ${cur.tags.join(' ')}`.toLocaleLowerCase();

    items.push({
      videoId: cur.videoId,
      title,
      description,
      publishedAt,
      tags: uniqueSorted(cur.tags),
      durationIso,
      ymd,
      dayNum,
      year: Number.isFinite(year) ? year : null,
      dateNum,
      durationSec,
      searchText,
    });
  }

  // Default sorting: newest first
  items.sort((a, b) => b.dateNum - a.dateNum);

  // Determine duration range upper bound (minutes)
  const minutes = items
    .map((it) => (it.durationSec != null ? Math.ceil(it.durationSec / 60) : null))
    .filter((v): v is number => v != null);
  const maxMinutes = Math.max(240, ...(minutes.length ? minutes : [0]));

  return { items, durationMaxBoundMinutes: maxMinutes };
}

// ============================================================================
// New staged loading functions for optimized schema
// ============================================================================

/**
 * Build a tag lookup map from TagPreview tuples.
 * Returns a Map of tagId -> tag name.
 */
export function buildTagPreviewMap(preview: TagPreviewTuple[]): Map<number, string> {
  const map = new Map<number, string>();
  for (const [tagId, , tagName] of preview) {
    map.set(tagId, tagName);
  }
  return map;
}

/**
 * Build a full tag lookup map from TagMaster.
 * Returns a Map of tagId -> tag name.
 */
export function buildTagMasterMap(tags: TagMasterJson['tags']): Map<number, string> {
  const map = new Map<number, string>();
  for (let i = 0; i < tags.length; i++) {
    const entry = tags[i];
    const tagName = entry[1];
    map.set(i, tagName);
  }
  return map;
}

/**
 * Convert a tuple-based video item to VideoItem format.
 */
function tupleToVideoItem(
  tuple: LatestItemTuple | ArchiveItemTuple,
  tagLookup: Map<number, string>
): VideoItem {
  const [videoId, title, , publishedAtEpoch, durationSec, tagIds] = tuple;

  const publishedAt = epochSecToIso(publishedAtEpoch);
  const ymd = epochSecToYmdJst(publishedAtEpoch);
  const dayNum = ymd ? ymdToDayNumJst(ymd) : null;
  const year = ymd ? Number(ymd.slice(0, 4)) : null;
  const dateNum = dayNum ?? Number.NEGATIVE_INFINITY;

  // Resolve tag IDs to tag names
  const tags = tagIds.map((id) => tagLookup.get(id) ?? `tag_${id}`).filter(Boolean);

  const searchText = `${title} ${videoId} ${tags.join(' ')}`.toLocaleLowerCase();

  return {
    videoId,
    title,
    description: '', // Not included in new schema for size optimization
    publishedAt,
    tags: uniqueSorted(tags),
    durationIso: null, // New schema uses seconds directly
    ymd,
    dayNum,
    year: Number.isFinite(year) ? year : null,
    dateNum,
    durationSec: durationSec > 0 ? durationSec : null,
    searchText,
  };
}

/**
 * Convert bootstrap data to VideoItem array.
 */
export function parseBootstrapItems(bootstrap: BootstrapJson): VideoItem[] {
  const tagLookup = buildTagPreviewMap(bootstrap.tagPreview);
  return bootstrap.latest.map((tuple) => tupleToVideoItem(tuple, tagLookup));
}

/**
 * Convert archive index page to VideoItem array.
 */
export function parseArchivePageItems(
  page: ArchiveIndexPageJson,
  tagLookup: Map<number, string>
): VideoItem[] {
  return page.items.map((tuple) => tupleToVideoItem(tuple, tagLookup));
}

/**
 * Calculate duration max bound from items.
 */
export function calculateDurationMaxBound(items: VideoItem[]): number {
  const minutes = items
    .map((it) => (it.durationSec != null ? Math.ceil(it.durationSec / 60) : null))
    .filter((v): v is number => v != null);
  return Math.max(240, ...(minutes.length ? minutes : [0]));
}

/**
 * Staged data loader class for the new optimized schema.
 */
export class StagedDataLoader {
  private baseUrl: string;
  private tagLookup: Map<number, string> = new Map();
  private items: VideoItem[] = [];
  private bootstrapData: BootstrapJson | null = null;
  private tagMasterData: TagMasterJson | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  /**
   * Phase 1: Load bootstrap.json and return initial items.
   */
  async loadBootstrap(): Promise<{ items: VideoItem[]; bootstrap: BootstrapJson }> {
    const bootstrap = await loadJsonFromPublic<BootstrapJson>(`${this.baseUrl}bootstrap.json`);
    this.bootstrapData = bootstrap;
    this.tagLookup = buildTagPreviewMap(bootstrap.tagPreview);
    this.items = parseBootstrapItems(bootstrap);
    return { items: this.items, bootstrap };
  }

  /**
   * Phase 2: Load tag_master.json and update tag lookup.
   */
  async loadTagMaster(): Promise<TagMasterJson> {
    if (!this.bootstrapData) {
      throw new Error('Bootstrap must be loaded first');
    }
    const url = this.bootstrapData.next.tagMaster.url;
    const tagMaster = await loadJsonFromPublic<TagMasterJson>(`${this.baseUrl}${url}`);
    this.tagMasterData = tagMaster;
    this.tagLookup = buildTagMasterMap(tagMaster.tags);
    return tagMaster;
  }

  /**
   * Phase 3: Load archive index pages incrementally.
   * Returns items from the specified page.
   */
  async loadArchivePage(pageNum: number): Promise<{ items: VideoItem[]; page: ArchiveIndexPageJson }> {
    if (!this.bootstrapData) {
      throw new Error('Bootstrap must be loaded first');
    }
    const pattern = this.bootstrapData.next.archiveIndex.urlPattern;
    const url = pattern.replace('{page}', String(pageNum));
    const page = await loadJsonFromPublic<ArchiveIndexPageJson>(`${this.baseUrl}${url}`);
    const pageItems = parseArchivePageItems(page, this.tagLookup);
    return { items: pageItems, page };
  }

  /**
   * Get total number of archive pages based on bootstrap info.
   */
  getTotalPages(): number {
    if (!this.bootstrapData) return 0;
    // This would need to be calculated from bootstrap or first page load
    return 0;
  }

  /**
   * Get current tag lookup map.
   */
  getTagLookup(): Map<number, string> {
    return this.tagLookup;
  }

  /**
   * Get bootstrap data.
   */
  getBootstrapData(): BootstrapJson | null {
    return this.bootstrapData;
  }

  /**
   * Get tag master data.
   */
  getTagMasterData(): TagMasterJson | null {
    return this.tagMasterData;
  }
}
