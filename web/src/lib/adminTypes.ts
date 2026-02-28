export type RunStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'partial' | 'cancelled' | 'rolled_back';

export type IngestionRunSummary = {
  runId: string;
  status: RunStatus;
  processedCount: number;
  succeededCount: number;
  failedCount: number;
  startedAt: string;
  finishedAt?: string;
  retryable: boolean;
  errorSummary?: string;
};

export type IngestionRunItem = {
  videoId: string;
  status: 'succeeded' | 'failed' | 'unprocessed';
  failureReasonCode?: string;
  processedAt?: string;
};

export type DiagnosticsHealth = {
  status: 'ok' | 'degraded' | 'critical';
  checks: {
    dataFreshness: string;
    tagMasterConsistency: string;
    archivePageCompleteness: string;
    distributionAvailability: string;
  };
};

export type RecheckRunResult = {
  recheckRunId: string;
  status: RunStatus;
  mode?: 'before_delivery' | 'after_delivery';
  totalCount: number;
  diffSummary: {
    changedCount: number;
    unchangedCount: number;
    failedCount: number;
  };
};

export type PublishRunStatus = {
  publishRunId: string;
  publishType: 'tag_master' | 'archive' | 'all' | 'docs';
  status: 'queued' | 'running' | 'succeeded' | 'failed' | 'partial' | 'cancelled' | 'rolled_back';
  startedAt: string;
  finishedAt?: string;
  retryable: boolean;
  errorCode?: string;
  errorMessage?: string;
};

export type TagImportResult = {
  importRunId: string;
  validatedCount: number;
  appliedCount: number;
  rejectedCount: number;
  nextAction: 'publish_required' | 'no_change';
};
