import {
  buildTagPreviewMap,
  buildTagMasterMap,
  parseBootstrapItems,
  parseArchivePageItems,
  calculateDurationMaxBound,
} from '../data';
import type { BootstrapJson, TagMasterJson, ArchiveIndexPageJson } from '../schema';

describe('buildTagPreviewMap', () => {
  it('builds a map from tagId to tagName', () => {
    const preview: [number, number, string][] = [
      [0, 1, 'ゲーム'],
      [1, 1, '雑談'],
      [2, 2, 'マインクラフト'],
    ];

    const map = buildTagPreviewMap(preview);

    expect(map.get(0)).toBe('ゲーム');
    expect(map.get(1)).toBe('雑談');
    expect(map.get(2)).toBe('マインクラフト');
    expect(map.get(99)).toBeUndefined();
  });

  it('handles empty array', () => {
    const map = buildTagPreviewMap([]);
    expect(map.size).toBe(0);
  });
});

describe('buildTagMasterMap', () => {
  it('builds a map from array index to tagName', () => {
    const tags: TagMasterJson['tags'] = [
      [1, 'ゲーム'],
      [1, '雑談'],
      [2, 'マインクラフト'],
    ];

    const map = buildTagMasterMap(tags);

    expect(map.get(0)).toBe('ゲーム');
    expect(map.get(1)).toBe('雑談');
    expect(map.get(2)).toBe('マインクラフト');
    expect(map.get(99)).toBeUndefined();
  });
});

describe('parseBootstrapItems', () => {
  const mockBootstrap: BootstrapJson = {
    schemaVersion: '1.0.0',
    bootstrapVersion: 'abc123',
    generatedAt: '2026-01-01T00:00:00Z',
    tagMasterVersion: 'def456',
    archiveVersion: 'ghi789',
    tagTypes: [
      { id: 1, key: '大分類', name: '大分類', order: 1 },
      { id: 2, key: 'ゲーム名', name: 'ゲーム名', order: 2 },
    ],
    tagPreview: [
      [0, 1, 'ゲーム'],
      [1, 2, 'マインクラフト'],
    ],
    latest: [
      // [videoId, title, channelTagId, publishedAtEpochSec, durationSec, tagIds]
      ['abc123xyz', 'テスト動画1', 0, 1704067200, 3600, [0, 1]], // 2024-01-01 00:00:00 UTC
      ['def456uvw', 'テスト動画2', 0, 1704153600, 1800, [0]], // 2024-01-02 00:00:00 UTC
    ],
    next: {
      tagMaster: { url: 'tag_master.json' },
      archiveIndex: { pageSize: 100, urlPattern: 'archive_index.p{page}.json' },
    },
  };

  it('converts bootstrap to VideoItem array', () => {
    const items = parseBootstrapItems(mockBootstrap);

    expect(items).toHaveLength(2);
    expect(items[0].videoId).toBe('abc123xyz');
    expect(items[0].title).toBe('テスト動画1');
    expect(items[0].durationSec).toBe(3600);
    expect(items[0].tags).toContain('ゲーム');
    expect(items[0].tags).toContain('マインクラフト');
    expect(items[0].ymd).toBe('2024-01-01');
  });

  it('handles items with unknown tag IDs gracefully', () => {
    const bootstrap: BootstrapJson = {
      ...mockBootstrap,
      latest: [['xyz', 'Test', 0, 1704067200, 60, [99]]],
    };

    const items = parseBootstrapItems(bootstrap);
    expect(items).toHaveLength(1);
    // Unknown tag ID should result in fallback name
    expect(items[0].tags.some((t) => t.includes('tag_99'))).toBe(true);
  });
});

describe('parseArchivePageItems', () => {
  it('converts archive page items using tag lookup', () => {
    const tagLookup = new Map<number, string>([
      [0, 'ゲーム'],
      [1, '雑談'],
    ]);

    const page: ArchiveIndexPageJson = {
      schemaVersion: '1.0.0',
      archiveVersion: 'abc123',
      tagMasterVersion: 'def456',
      generatedAt: '2026-01-01T00:00:00Z',
      page: 0,
      pageSize: 100,
      total: 2,
      items: [
        ['video1', 'Title 1', 0, 1704067200, 3600, [0]],
        ['video2', 'Title 2', 0, 1704153600, 1800, [0, 1]],
      ],
    };

    const items = parseArchivePageItems(page, tagLookup);

    expect(items).toHaveLength(2);
    expect(items[0].videoId).toBe('video1');
    expect(items[0].tags).toContain('ゲーム');
    expect(items[1].tags).toContain('雑談');
  });
});

describe('calculateDurationMaxBound', () => {
  it('returns at least 240 minutes', () => {
    const items = [
      { durationSec: 60 }, // 1 minute
      { durationSec: 120 }, // 2 minutes
    ] as any[];

    expect(calculateDurationMaxBound(items)).toBe(240);
  });

  it('returns max duration when greater than 240', () => {
    const items = [
      { durationSec: 18000 }, // 300 minutes
      { durationSec: 7200 }, // 120 minutes
    ] as any[];

    expect(calculateDurationMaxBound(items)).toBe(300);
  });

  it('handles null durations', () => {
    const items = [
      { durationSec: null },
      { durationSec: 3600 }, // 60 minutes
      { durationSec: undefined },
    ] as any[];

    expect(calculateDurationMaxBound(items)).toBe(240);
  });

  it('handles empty array', () => {
    expect(calculateDurationMaxBound([])).toBe(240);
  });
});
