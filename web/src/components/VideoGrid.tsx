import { useState } from 'react';
import type { VideoItem } from '../lib/data';
import { formatDuration } from '../lib/duration';
import { ytThumbUrl } from '../lib/youtube';

export function VideoGrid({
  items,
  onOpen,
  onToggleTag,
  selectedTags,
  hasMore,
  onLoadMore,
}: {
  items: VideoItem[];
  onOpen: (videoId: string) => void;
  onToggleTag: (tag: string) => void;
  selectedTags: Set<string>;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (items.length === 0) {
    return (
      <div id="empty" className="empty">
        該当なし
      </div>
    );
  }

  return (
    <>
      <section id="grid" className="grid" aria-label="動画一覧">
        {items.map((it) => (
          <VideoCard key={it.videoId} item={it} onOpen={onOpen} onToggleTag={onToggleTag} selectedTags={selectedTags} />
        ))}
      </section>

      <div className="moreWrap">
        {hasMore ? (
          <button id="moreBtn" className="btn" type="button" onClick={onLoadMore}>
            さらに表示
          </button>
        ) : (
          <small>末尾</small>
        )}
      </div>
    </>
  );
}

function VideoCard({
  item,
  onOpen,
  onToggleTag,
  selectedTags,
}: {
  item: VideoItem;
  onOpen: (videoId: string) => void;
  onToggleTag: (tag: string) => void;
  selectedTags: Set<string>;
}) {
  const [thumbOk, setThumbOk] = useState<boolean>(true);

  const dateText = item.ymd ? item.ymd : '日付なし';
  const durText = formatDuration(item.durationSec);

  return (
    <article className="card" role="button" tabIndex={0} onClick={() => onOpen(item.videoId)} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpen(item.videoId);
      }
    }}>
      <div className="thumb">
        {thumbOk && (
          <img
            src={ytThumbUrl(item.videoId)}
            alt=""
            loading="lazy"
            onError={() => setThumbOk(false)}
          />
        )}
      </div>

      <div className="body">
        <div className="title" title={item.title || item.videoId}>
          {item.title || item.videoId}
        </div>

        <div className="meta">
          <span>{dateText}</span>
          <span>•</span>
          <span>{durText}</span>
          <span>•</span>
          <span>{item.tags.length} tags</span>
        </div>

        <div className="tags" aria-label="タグ">
          {item.tags.slice(0, 6).map((t) => (
            <button
              key={t}
              className="tag"
              type="button"
              data-selected={selectedTags.has(t)}
              onClick={(e) => {
                e.stopPropagation();
                onToggleTag(t);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </article>
  );
}
