// Type definitions for the new optimized data schema
// Based on docs/速度改善対応.md

// ============================================================================
// Tag Type Definition (shared across bootstrap and tag_master)
// ============================================================================

export type TagTypeEntry = {
  id: number;
  key: string;
  name: string;
  order: number;
  singleSelect?: boolean;
  requiredPerVideo?: boolean;
};

// ============================================================================
// A) bootstrap.json - Latest 30 items with embedded tag preview
// ============================================================================

// Tag preview tuple: [tagId, tagTypeId, tagName]
export type TagPreviewTuple = [number, number, string];

// Latest item tuple: [videoId, title, channelTagId, publishedAtEpochSec, durationSec, tagIds]
export type LatestItemTuple = [string, string, number, number, number, number[]];

export type BootstrapJson = {
  schemaVersion: string;
  bootstrapVersion: string;
  generatedAt: string;
  tagMasterVersion: string;
  archiveVersion: string;
  tagTypes: TagTypeEntry[];
  tagPreview: TagPreviewTuple[];
  latest: LatestItemTuple[];
  next: {
    tagMaster: {
      url: string;
    };
    archiveIndex: {
      pageSize: number;
      urlPattern: string;
    };
  };
};

// ============================================================================
// B) tag_master.json - Full tag dictionary
// ============================================================================

// Tag tuple: [tagTypeId, tagName, aliases?, deprecated?, mergedInto?]
export type TagMasterTuple = [number, string] | [number, string, string[]] | [number, string, string[], boolean] | [number, string, string[], boolean, number | null];

export type TagMasterJson = {
  schemaVersion: string;
  tagMasterVersion: string;
  generatedAt: string;
  tagTypes: Array<TagTypeEntry & { singleSelect: boolean; requiredPerVideo: boolean }>;
  tags: TagMasterTuple[];
};

// ============================================================================
// C) archive_index.pageN.json - Paged archive index
// ============================================================================

// Item tuple: [videoId, title, channelTagId, publishedAtEpochSec, durationSec, tagIds]
export type ArchiveItemTuple = [string, string, number, number, number, number[]];

export type ArchiveIndexPageJson = {
  schemaVersion: string;
  archiveVersion: string;
  tagMasterVersion: string;
  generatedAt: string;
  page: number;
  pageSize: number;
  total: number;
  items: ArchiveItemTuple[];
};

// ============================================================================
// Helper types for decoded/expanded data
// ============================================================================

export type DecodedTag = {
  id: number;
  typeId: number;
  name: string;
  typeName: string;
  aliases?: string[];
  deprecated?: boolean;
  mergedInto?: number | null;
};

export type DecodedVideoItem = {
  videoId: string;
  title: string;
  channelTagId: number;
  publishedAtEpoch: number;
  durationSec: number;
  tagIds: number[];
};

// ============================================================================
// Data loading state
// ============================================================================

export type LoadingPhase = 'idle' | 'bootstrap' | 'tag_master' | 'archive' | 'complete' | 'error';

export type DataLoadState = {
  phase: LoadingPhase;
  bootstrapLoaded: boolean;
  tagMasterLoaded: boolean;
  archivePagesLoaded: number;
  archiveTotalPages: number;
  error: string | null;
};
