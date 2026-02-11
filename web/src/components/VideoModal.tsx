import { useEffect, useMemo, useRef } from 'react';
import type { VideoItem } from '../lib/data';
import { formatDuration } from '../lib/duration';
import { ytEmbedUrl, ytWatchUrl } from '../lib/youtube';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function VideoModal({
  item,
  onClose,
  onToggleTag,
  selectedTags,
  toast,
}: {
  item: VideoItem | null;
  onClose: () => void;
  onToggleTag: (tag: string) => void;
  selectedTags: Set<string>;
  toast: (msg: string) => void;
}) {
  const dlgRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;

    if (item) {
      if (!dlg.open) dlg.showModal();
    } else {
      if (dlg.open) dlg.close();
    }
  }, [item]);

  const watchUrl = useMemo(() => (item ? ytWatchUrl(item.videoId) : ''), [item]);
  const embedUrl = useMemo(() => (item ? ytEmbedUrl(item.videoId) : ''), [item]);

  const metaText = useMemo(() => {
    if (!item) return '';
    const parts = [
      item.ymd || '日付なし',
      formatDuration(item.durationSec),
      item.videoId,
    ];
    return parts.join(' • ');
  }, [item]);

  return (
    <dialog
      id="dlg"
      ref={dlgRef}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      {item && (
        <div className="modal">
          <div className="modalLeft">
            <div className="player">
              <iframe
                id="player"
                src={embedUrl}
                title="YouTube player"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="kv">
              <div className="k">Tags</div>
              <div className="modalTags">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="chip"
                    data-on={selectedTags.has(t)}
                    onClick={() => {
                      onToggleTag(t);
                      toast(`タグ切替: ${t}`);
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="modalRight">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
              <h3 id="dlgTitle">{item.title || item.videoId}</h3>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  dlgRef.current?.close();
                }}
              >
                閉じる
              </button>
            </div>

            <div className="kv">
              <div className="k">Meta</div>
              <div className="v">{metaText}</div>
            </div>

            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <button
                className="btn primary"
                type="button"
                onClick={() => window.open(watchUrl, '_blank', 'noopener,noreferrer')}
              >
                YouTubeで開く
              </button>
              <button
                className="btn"
                type="button"
                onClick={async () => {
                  const ok = await copyText(watchUrl);
                  toast(ok ? 'URLをコピーしました' : 'コピーに失敗しました');
                }}
              >
                URLコピー
              </button>
              <button
                className="btn"
                type="button"
                onClick={async () => {
                  const ok = await copyText(item.videoId);
                  toast(ok ? 'IDをコピーしました' : 'コピーに失敗しました');
                }}
              >
                IDコピー
              </button>
            </div>

            <div className="kv">
              <div className="k">Notes</div>
              <div className="v" style={{ fontFamily: 'var(--sans)', color: 'var(--muted)' }}>
                右上のFiltersから「タグ分布」「年別分布」「日付レンジ」を確認しながら探索する想定です。
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
