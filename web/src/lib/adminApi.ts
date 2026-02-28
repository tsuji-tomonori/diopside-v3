import type {
  DiagnosticsHealth,
  IngestionRunItem,
  IngestionRunSummary,
  PublishRunStatus,
  RecheckRunResult,
  TagImportResult,
} from './adminTypes';

function readViteEnv(key: string): string | undefined {
  try {
    return Function('k', 'try { return import.meta.env?.[k]; } catch { return undefined; }')(key) as string | undefined;
  } catch {
    return undefined;
  }
}

const BASE_URL = (readViteEnv('VITE_ADMIN_API_BASE_URL')?.trim() || '').replace(/\/$/, '');
const STATIC_AUTH_TOKEN = readViteEnv('VITE_ADMIN_API_TOKEN')?.trim() || null;

let authTokenProvider: () => string | null = () => STATIC_AUTH_TOKEN;

export function setAdminAuthTokenProvider(provider: () => string | null) {
  authTokenProvider = provider;
}

export function hasStaticAdminToken(): boolean {
  return STATIC_AUTH_TOKEN != null;
}

const knownRunIds = new Set<string>();

function apiPath(path: string): string {
  if (!BASE_URL) return path;
  return `${BASE_URL}${path}`;
}

function newIdempotencyKey(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const token = authTokenProvider();
  if (!token) {
    throw new Error(`API 401 ${path} (ADMIN_AUTH_REQUIRED)`);
  }

  const headers = new Headers(init?.headers ?? {});
  headers.set('authorization', `Bearer ${token}`);
  if (init?.body) {
    headers.set('content-type', 'application/json');
  }

  const res = await fetch(apiPath(path), {
    ...init,
    headers,
  });

  if (!res.ok) {
    let detail = '';
    try {
      const p = (await res.json()) as { code?: string; detail?: string; message?: string };
      detail = p.code || p.detail || p.message || '';
    } catch {
      detail = '';
    }
    throw new Error(`API ${res.status} ${path}${detail ? ` (${detail})` : ''}`);
  }

  return (await res.json()) as T;
}

type IngestionRunApi = {
  run_id: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'partial' | 'cancelled';
  processed_count: number;
  success_count?: number;
  failed_count?: number;
  accepted_at: string;
  finished_at: string | null;
  error_summary: string | null;
};

function mapRun(api: IngestionRunApi): IngestionRunSummary {
  return {
    runId: api.run_id,
    status: api.status,
    processedCount: api.processed_count,
    succeededCount: api.success_count ?? 0,
    failedCount: api.failed_count ?? 0,
    startedAt: api.accepted_at,
    ...(api.finished_at != null ? { finishedAt: api.finished_at } : {}),
    retryable: api.status === 'failed' || api.status === 'partial',
    ...(api.error_summary != null ? { errorSummary: api.error_summary } : {}),
  };
}

export const adminApi = {
  async startIngestion(payload: {
    trigger_mode: 'manual' | 'scheduled';
    run_kind: 'official_ingestion' | 'appearance_supplement' | 'incremental_update';
    target_types: Array<'official' | 'appearance'>;
    from_published_at?: string;
  }): Promise<{ run_id: string; accepted_at: string }> {
    const res = await requestJson<{ run_id: string; accepted_at: string }>('/api/v1/ops/ingestion/runs', {
      method: 'POST',
      headers: {
        'idempotency-key': newIdempotencyKey('ingest'),
      },
      body: JSON.stringify(payload),
    });
    knownRunIds.add(res.run_id);
    return res;
  },

  async getIngestionLatest(): Promise<{ last_run_id: string | null }> {
    return requestJson<{ last_run_id: string | null }>('/api/v1/ops/ingestion/latest');
  },

  async listRuns(): Promise<IngestionRunSummary[]> {
    if (knownRunIds.size === 0) {
      const latest = await this.getIngestionLatest();
      if (latest.last_run_id) knownRunIds.add(latest.last_run_id);
    }

    const ids = Array.from(knownRunIds);
    const runs = await Promise.all(
      ids.map(async (runId) => {
        try {
          return await this.getRun(runId);
        } catch {
          return null;
        }
      }),
    );

    return runs
      .filter((v): v is IngestionRunSummary => v != null)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  },

  async getRun(runId: string): Promise<IngestionRunSummary> {
    const res = await requestJson<IngestionRunApi>(`/api/v1/ops/ingestion/runs/${runId}`);
    knownRunIds.add(runId);
    return mapRun(res);
  },

  async getRunItems(runId: string): Promise<IngestionRunItem[]> {
    const res = await requestJson<{
      run_id: string;
      items: Array<{
        video_id: string;
        status: 'succeeded' | 'failed';
        error_code: string | null;
      }>;
    }>(`/api/v1/ops/ingestion/runs/${runId}/items`);

    return res.items.map((it) => ({
      videoId: it.video_id,
      status: it.status,
      ...(it.error_code != null ? { failureReasonCode: it.error_code } : {}),
    }));
  },

  async retryRun(runId: string): Promise<{ retryRunId: string }> {
    const res = await requestJson<{ run_id: string }>(`/api/v1/ops/ingestion/runs/${runId}/retry`, {
      method: 'POST',
      headers: {
        'idempotency-key': newIdempotencyKey('retry'),
      },
    });
    knownRunIds.add(res.run_id);
    return { retryRunId: res.run_id };
  },

  async getDiagnosticsHealth(): Promise<DiagnosticsHealth> {
    const res = await requestJson<{
      status: 'ok' | 'degraded' | 'critical';
      checks: {
        data_freshness: string;
        tag_master_consistency: string;
        archive_page_completeness: string;
        distribution_availability: string;
      };
    }>('/api/v1/ops/diagnostics/health');

    return {
      status: res.status,
      checks: {
        dataFreshness: res.checks.data_freshness,
        tagMasterConsistency: res.checks.tag_master_consistency,
        archivePageCompleteness: res.checks.archive_page_completeness,
        distributionAvailability: res.checks.distribution_availability,
      },
    };
  },

  async createRecheck(payload: { runId: string }): Promise<{ recheckRunId: string }> {
    const res = await requestJson<{ recheck_run_id: string }>('/api/v1/ops/rechecks', {
      method: 'POST',
      body: JSON.stringify({ run_id: payload.runId }),
    });
    return { recheckRunId: res.recheck_run_id };
  },

  async getRecheckResult(recheckRunId: string): Promise<RecheckRunResult> {
    const res = await requestJson<{
      recheck_run_id: string;
      status: 'queued' | 'running' | 'succeeded' | 'failed' | 'partial' | 'cancelled';
      diff_summary: { changed_count: number; unchanged_count: number };
    }>(`/api/v1/ops/rechecks/${recheckRunId}`);

    return {
      recheckRunId: res.recheck_run_id,
      status: res.status,
      totalCount: res.diff_summary.changed_count + res.diff_summary.unchanged_count,
      diffSummary: {
        changedCount: res.diff_summary.changed_count,
        unchangedCount: res.diff_summary.unchanged_count,
        failedCount: 0,
      },
    };
  },

  async importTaggingJson(payload: {
    schemaVersion: 'v1';
    items: Array<{ videoId: string; set: string[]; unset: string[]; reason: string }>;
  }): Promise<TagImportResult> {
    const res = await requestJson<{
      import_run_id: string;
      validated_count: number;
      applied_count: number;
      rejected_count: number;
      next_action: 'publish_required' | 'no_change';
    }>('/api/v1/admin/tagging/imports', {
      method: 'POST',
      body: JSON.stringify({
        schema_version: payload.schemaVersion,
        items: payload.items.map((it) => ({
          video_id: it.videoId,
          set: it.set,
          unset: it.unset,
          reason: it.reason,
        })),
      }),
    });

    return {
      importRunId: res.import_run_id,
      validatedCount: res.validated_count,
      appliedCount: res.applied_count,
      rejectedCount: res.rejected_count,
      nextAction: res.next_action,
    };
  },

  async startDocsPublish(): Promise<{ docsPublishRunId: string }> {
    const res = await requestJson<{ docs_publish_run_id: string }>('/api/v1/admin/docs/publish', {
      method: 'POST',
    });
    return { docsPublishRunId: res.docs_publish_run_id };
  },

  async getDocsPublishRun(docsPublishRunId: string): Promise<PublishRunStatus> {
    const res = await requestJson<{
      docs_publish_run_id: string;
      status: 'queued' | 'running' | 'succeeded' | 'failed' | 'partial' | 'cancelled' | 'rolled_back';
    }>(`/api/v1/admin/docs/publish/${docsPublishRunId}`);

    return {
      publishRunId: res.docs_publish_run_id,
      publishType: 'docs',
      status: res.status,
      startedAt: '',
      retryable: res.status === 'failed' || res.status === 'partial',
    };
  },

  async startPublishRun(scope: 'tag_master' | 'archive' | 'all' = 'all'): Promise<{ publishRunId: string }> {
    const res = await requestJson<{ publish_run_id: string }>('/api/v1/admin/publish/tag-master', {
      method: 'POST',
      body: JSON.stringify({ scope }),
    });
    return { publishRunId: res.publish_run_id };
  },

  async getPublishRun(publishRunId: string): Promise<PublishRunStatus> {
    const res = await requestJson<{
      publish_run_id: string;
      publish_type: 'tag_master' | 'archive' | 'all' | 'docs';
      status: 'queued' | 'running' | 'succeeded' | 'failed' | 'partial' | 'cancelled' | 'rolled_back';
      started_at: string;
      finished_at: string | null;
      retryable: boolean;
      error_code: string | null;
      error_message: string | null;
    }>(`/api/v1/admin/publish/${publishRunId}`);

    return {
      publishRunId: res.publish_run_id,
      publishType: res.publish_type,
      status: res.status,
      startedAt: res.started_at,
      ...(res.finished_at != null ? { finishedAt: res.finished_at } : {}),
      retryable: res.retryable,
      ...(res.error_code != null ? { errorCode: res.error_code } : {}),
      ...(res.error_message != null ? { errorMessage: res.error_message } : {}),
    };
  },
};
