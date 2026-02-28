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
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;
    const dlg = dlgRef.current;
    if (!dlg || !dlg.open) return;

    const focusables = Array.from(
      dlg.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'));

    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    const active = document.activeElement as HTMLElement | null;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  };

  useEffect(() => {
    const dlg = dlgRef.current;
    if (!dlg) return;

    if (item) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      if (!dlg.open) dlg.showModal();
      queueMicrotask(() => {
        closeButtonRef.current?.focus();
      });
      window.addEventListener('keydown', trapFocus);
    } else {
      if (dlg.open) dlg.close();
      window.removeEventListener('keydown', trapFocus);
      returnFocusRef.current?.focus();
    }
    return () => {
      window.removeEventListener('keydown', trapFocus);
    };
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="dlgTitle"
      aria-describedby="dlgMeta"
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
              <h3 id="dlgTitle" tabIndex={-1}>
                {item.title || item.videoId}
              </h3>
              <button
                ref={closeButtonRef}
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
              <div id="dlgMeta" className="v">
                {metaText}
              </div>
            </div>

            <div className="srOnly" role="status" aria-live="polite">
              モーダルを表示中です。Escで閉じられます。
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
