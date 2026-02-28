import { useMemo, useState } from 'react';
import { adminApi } from '../lib/adminApi';
import type { IngestionRunItem, IngestionRunSummary, PublishRunStatus, RecheckRunResult, TagImportResult } from '../lib/adminTypes';

type AdminTab = 'A01' | 'A02' | 'A03' | 'A04' | 'A06' | 'A05';

const TAB_LABELS: Array<{ key: AdminTab; label: string }> = [
  { key: 'A01', label: 'A01 収集実行' },
  { key: 'A02', label: 'A02 監視・履歴' },
  { key: 'A03', label: 'A03 再収集' },
  { key: 'A04', label: 'A04 配信前後確認' },
  { key: 'A06', label: 'A06 配信反映ジョブ' },
  { key: 'A05', label: 'A05 公開後運用' },
];

export function AdminPanel({ toast }: { toast: (msg: string) => void }) {
  const [tab, setTab] = useState<AdminTab>('A01');

  return (
    <section className="adminShell" aria-label="管理画面">
      <div className="adminNav" role="tablist" aria-label="管理画面タブ">
        {TAB_LABELS.map((it) => (
          <button
            key={it.key}
            className={`btn tiny ${tab === it.key ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={tab === it.key}
            onClick={() => setTab(it.key)}
          >
            {it.label}
          </button>
        ))}
      </div>

      <div className="adminBody">
        {tab === 'A01' && <A01IngestionStart toast={toast} />}
        {tab === 'A02' && <A02RunStatus toast={toast} />}
        {tab === 'A03' && <A03Retry toast={toast} />}
        {tab === 'A04' && <A04TagImport toast={toast} />}
        {tab === 'A06' && <A06PublishJob toast={toast} />}
        {tab === 'A05' && <A05OpsHealth toast={toast} />}
      </div>
    </section>
  );
}

function A01IngestionStart({ toast }: { toast: (msg: string) => void }) {
  const [triggerMode, setTriggerMode] = useState<'manual' | 'scheduled'>('manual');
  const [runKind, setRunKind] = useState<'official_ingestion' | 'appearance_supplement' | 'incremental_update'>('official_ingestion');
  const [targetOfficial, setTargetOfficial] = useState(true);
  const [targetAppearance, setTargetAppearance] = useState(false);
  const [fromPublishedAt, setFromPublishedAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ run_id: string; accepted_at: string } | null>(null);

  const invalid = !targetOfficial && !targetAppearance;

  const submit = async () => {
    if (invalid || submitting) return;
    setSubmitting(true);
    try {
      const res = await adminApi.startIngestion({
        trigger_mode: triggerMode,
        run_kind: runKind,
        target_types: [targetOfficial ? 'official' : null, targetAppearance ? 'appearance' : null].filter(
          (v): v is 'official' | 'appearance' => v != null,
        ),
        from_published_at: fromPublishedAt ? new Date(fromPublishedAt).toISOString() : undefined,
      });
      setResult(res);
      toast(`収集実行を受け付けました: ${res.run_id}`);
    } catch (e) {
      toast(`収集実行の開始に失敗: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="adminPanel">
      <h2>UI-A01 収集実行</h2>
      <div className="adminGrid2">
        <label className="field">
          <span>取得モード</span>
          <select value={triggerMode} onChange={(e) => setTriggerMode(e.target.value as 'manual' | 'scheduled')}>
            <option value="manual">manual</option>
            <option value="scheduled">scheduled</option>
          </select>
        </label>
        <label className="field">
          <span>収集種別</span>
          <select
            value={runKind}
            onChange={(e) =>
              setRunKind(e.target.value as 'official_ingestion' | 'appearance_supplement' | 'incremental_update')
            }
          >
            <option value="official_ingestion">official_ingestion</option>
            <option value="appearance_supplement">appearance_supplement</option>
            <option value="incremental_update">incremental_update</option>
          </select>
        </label>
      </div>

      <div className="adminRow">
        <label>
          <input type="checkbox" checked={targetOfficial} onChange={(e) => setTargetOfficial(e.target.checked)} /> official
        </label>
        <label>
          <input type="checkbox" checked={targetAppearance} onChange={(e) => setTargetAppearance(e.target.checked)} /> appearance
        </label>
      </div>

      <label className="field">
        <span>from_published_at (任意)</span>
        <input type="datetime-local" value={fromPublishedAt} onChange={(e) => setFromPublishedAt(e.target.value)} />
      </label>

      <div className="adminRow">
        <button className="btn primary" type="button" onClick={submit} disabled={invalid || submitting}>
          {submitting ? '送信中...' : '収集実行を開始'}
        </button>
        {invalid && <span className="small">target_types は1つ以上必要です。</span>}
      </div>

      {result && (
        <div className="kv">
          <div className="k">Accepted</div>
          <div className="v mono">
            run_id={result.run_id} / accepted_at={result.accepted_at}
          </div>
        </div>
      )}
    </div>
  );
}

function A02RunStatus({ toast }: { toast: (msg: string) => void }) {
  const [runs, setRuns] = useState<IngestionRunSummary[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string>('');
  const [items, setItems] = useState<IngestionRunItem[]>([]);
  const [loading, setLoading] = useState(false);

  const selectedRun = useMemo(() => runs.find((r) => r.runId === selectedRunId) ?? null, [runs, selectedRunId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const rs = await adminApi.listRuns();
      setRuns(rs);
      if (!selectedRunId && rs.length > 0) setSelectedRunId(rs[0].runId);
    } catch (e) {
      toast(`run一覧取得失敗: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const loadItems = async () => {
    if (!selectedRunId) return;
    setLoading(true);
    try {
      const res = await adminApi.getRunItems(selectedRunId);
      setItems(res);
    } catch (e) {
      toast(`run明細取得失敗: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminPanel">
      <h2>UI-A02 実行監視・履歴</h2>
      <div className="adminRow">
        <button className="btn" type="button" onClick={refresh}>
          run一覧を再取得
        </button>
        <button className="btn" type="button" onClick={loadItems} disabled={!selectedRunId}>
          明細を取得
        </button>
        {loading && <span className="small">loading...</span>}
      </div>

      <div className="field">
        <label htmlFor="runSelect">run選択</label>
        <select id="runSelect" value={selectedRunId} onChange={(e) => setSelectedRunId(e.target.value)}>
          <option value="">(未選択)</option>
          {runs.map((r) => (
            <option key={r.runId} value={r.runId}>
              {r.runId} [{r.status}]
            </option>
          ))}
        </select>
      </div>

      {selectedRun && (
        <div className="kv">
          <div className="k">Summary</div>
          <div className="v mono">
            status={selectedRun.status} processed={selectedRun.processedCount} succeeded={selectedRun.succeededCount} failed={selectedRun.failedCount}
          </div>
        </div>
      )}

      {items.length > 0 && (
        <div className="adminList">
          {items.map((it) => (
            <div key={it.videoId} className="adminListItem">
              <div className="mono">{it.videoId}</div>
              <div>{it.status}</div>
              <div className="small">{it.failureReasonCode ?? '-'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function A03Retry({ toast }: { toast: (msg: string) => void }) {
  const [runId, setRunId] = useState('');

  return (
    <div className="adminPanel">
      <h2>UI-A03 再収集設定</h2>
      <label className="field">
        <span>source runId</span>
        <input value={runId} onChange={(e) => setRunId(e.target.value)} placeholder="ing-..." />
      </label>
      <div className="small">現在のAPI実装では、再収集は runId 指定のみ対応です。</div>
      <button
        className="btn primary"
        type="button"
        onClick={async () => {
          if (!runId) {
            toast('runIdを入力してください');
            return;
          }
          try {
            const res = await adminApi.retryRun(runId);
            toast(`再収集を受け付けました: ${res.retryRunId}`);
          } catch (e) {
            toast(`再収集失敗: ${e instanceof Error ? e.message : String(e)}`);
          }
        }}
      >
        再収集を開始
      </button>
    </div>
  );
}

function A04TagImport({ toast }: { toast: (msg: string) => void }) {
  const [videoId, setVideoId] = useState('');
  const [setTags, setSetTags] = useState('');
  const [unsetTags, setUnsetTags] = useState('');
  const [reason, setReason] = useState('manual review');
  const [result, setResult] = useState<TagImportResult | null>(null);

  return (
    <div className="adminPanel">
      <h2>UI-A04 配信前後確認・手動タグ付け</h2>
      <label className="field">
        <span>videoId</span>
        <input value={videoId} onChange={(e) => setVideoId(e.target.value)} />
      </label>
      <label className="field">
        <span>set tags (comma separated)</span>
        <input value={setTags} onChange={(e) => setSetTags(e.target.value)} />
      </label>
      <label className="field">
        <span>unset tags (comma separated)</span>
        <input value={unsetTags} onChange={(e) => setUnsetTags(e.target.value)} />
      </label>
      <label className="field">
        <span>reason</span>
        <input value={reason} onChange={(e) => setReason(e.target.value)} />
      </label>

      <button
        className="btn primary"
        type="button"
        onClick={async () => {
          if (!videoId.trim()) {
            toast('videoIdを入力してください');
            return;
          }

          try {
            const res = await adminApi.importTaggingJson({
              schemaVersion: 'v1',
              items: [
                {
                  videoId: videoId.trim(),
                  set: setTags
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean),
                  unset: unsetTags
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean),
                  reason,
                },
              ],
            });
            setResult(res);
            toast(`取込完了: applied=${res.appliedCount}`);
          } catch (e) {
            toast(`取込失敗: ${e instanceof Error ? e.message : String(e)}`);
          }
        }}
      >
        JSON取込（簡易）
      </button>

      {result && (
        <div className="kv">
          <div className="k">Import Result</div>
          <div className="v mono">
            importRunId={result.importRunId} applied={result.appliedCount} rejected={result.rejectedCount} next={result.nextAction}
          </div>
        </div>
      )}
    </div>
  );
}

function A06PublishJob({ toast }: { toast: (msg: string) => void }) {
  const [runId, setRunId] = useState('');
  const [publishStatus, setPublishStatus] = useState<PublishRunStatus | null>(null);
  const [fetchMode, setFetchMode] = useState<'docs' | 'publish'>('docs');

  return (
    <div className="adminPanel">
      <h2>UI-A06 配信反映ジョブ</h2>
      <div className="adminRow">
        <button
          className="btn primary"
          type="button"
          onClick={async () => {
            try {
              const res = await adminApi.startDocsPublish();
              setRunId(res.docsPublishRunId);
              setFetchMode('docs');
              toast(`docs publish run created: ${res.docsPublishRunId}`);
            } catch (e) {
              toast(`docs publish開始失敗: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          Docs配信を開始
        </button>
        <button
          className="btn"
          type="button"
          onClick={async () => {
            try {
              const res = await adminApi.startPublishRun('all');
              setRunId(res.publishRunId);
              setFetchMode('publish');
              toast(`publish run created: ${res.publishRunId}`);
            } catch (e) {
              toast(`publish開始失敗: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          tag-master配信を開始
        </button>
      </div>

      <label className="field">
        <span>publishRunId</span>
        <input value={runId} onChange={(e) => setRunId(e.target.value)} placeholder="docs-... / publish-..." />
      </label>

      <div className="adminRow">
        <label>
          <input type="radio" checked={fetchMode === 'docs'} onChange={() => setFetchMode('docs')} /> docs run
        </label>
        <label>
          <input type="radio" checked={fetchMode === 'publish'} onChange={() => setFetchMode('publish')} /> publish run
        </label>
      </div>

      <button
        className="btn"
        type="button"
        onClick={async () => {
          if (!runId.trim()) {
            toast('publishRunIdを入力してください');
            return;
          }
          try {
            const res =
              fetchMode === 'docs'
                ? await adminApi.getDocsPublishRun(runId.trim())
                : await adminApi.getPublishRun(runId.trim());
            setPublishStatus(res);
          } catch (e) {
            toast(`publish状態取得失敗: ${e instanceof Error ? e.message : String(e)}`);
          }
        }}
      >
        状態を取得
      </button>

      {publishStatus && (
        <div className="kv">
          <div className="k">Publish Status</div>
          <div className="v mono">
            {publishStatus.publishRunId} status={publishStatus.status} retryable={String(publishStatus.retryable)}
          </div>
        </div>
      )}
    </div>
  );
}

function A05OpsHealth({ toast }: { toast: (msg: string) => void }) {
  const [health, setHealth] = useState<RecheckRunResult | null>(null);
  const [diag, setDiag] = useState<string>('');
  const [recheckId, setRecheckId] = useState('');
  const [runIdForRecheck, setRunIdForRecheck] = useState('');

  return (
    <div className="adminPanel">
      <h2>UI-A05 公開後運用・配信経路確認</h2>
      <div className="adminRow">
        <button
          className="btn"
          type="button"
          onClick={async () => {
            try {
              const res = await adminApi.getDiagnosticsHealth();
              setDiag(`status=${res.status} freshness=${res.checks.dataFreshness} distribution=${res.checks.distributionAvailability}`);
            } catch (e) {
              toast(`運用診断取得失敗: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          診断を取得
        </button>
        <input
          className="mono"
          placeholder="runId for recheck"
          value={runIdForRecheck}
          onChange={(e) => setRunIdForRecheck(e.target.value)}
        />
        <button
          className="btn"
          type="button"
          onClick={async () => {
            if (!runIdForRecheck.trim()) {
              toast('再確認対象のrunIdを入力してください');
              return;
            }
            try {
              const created = await adminApi.createRecheck({
                runId: runIdForRecheck.trim(),
              });
              setRecheckId(created.recheckRunId);
              toast(`再確認run作成: ${created.recheckRunId}`);
            } catch (e) {
              toast(`再確認run作成失敗: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          再確認runを作成
        </button>
        <button
          className="btn"
          type="button"
          onClick={async () => {
            if (!recheckId) {
              toast('先に再確認runを作成してください');
              return;
            }
            try {
              const res = await adminApi.getRecheckResult(recheckId);
              setHealth(res);
            } catch (e) {
              toast(`再確認結果取得失敗: ${e instanceof Error ? e.message : String(e)}`);
            }
          }}
        >
          再確認結果を取得
        </button>
      </div>

      {diag && (
        <div className="kv">
          <div className="k">Diagnostics</div>
          <div className="v mono">{diag}</div>
        </div>
      )}

      {health && (
        <div className="kv">
          <div className="k">Recheck</div>
          <div className="v mono">
            {health.recheckRunId} status={health.status} changed={health.diffSummary.changedCount} failed={health.diffSummary.failedCount}
          </div>
        </div>
      )}
    </div>
  );
}
