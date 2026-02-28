CREATE TABLE ingestion_runs (
  run_id UUID PRIMARY KEY,
  accepted_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ NULL,
  finished_at TIMESTAMPTZ NULL,
  trigger_mode TEXT NOT NULL,
  run_kind TEXT NOT NULL,
  target_types TEXT[] NOT NULL,
  status TEXT NOT NULL,
  parent_run_id UUID NULL,
  processed_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  error_summary TEXT NULL
);

CREATE INDEX idx_ingestion_runs_kind_status ON ingestion_runs (run_kind, status);

CREATE TABLE ingestion_items (
  id UUID PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES ingestion_runs(run_id) ON DELETE CASCADE,
  video_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  update_type TEXT NOT NULL,
  status TEXT NOT NULL,
  error_code TEXT NULL,
  error_message TEXT NULL
);

CREATE INDEX idx_ingestion_items_run_id ON ingestion_items (run_id);

CREATE TABLE idempotency_keys (
  id UUID PRIMARY KEY,
  idem_key TEXT NOT NULL,
  operator TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  run_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  CONSTRAINT uq_idempotency UNIQUE (idem_key, operator, endpoint, payload_hash)
);

CREATE INDEX idx_idempotency_expires ON idempotency_keys (expires_at);

CREATE TABLE tags (
  tag_id TEXT PRIMARY KEY,
  tag_name TEXT NOT NULL,
  tag_type_id INTEGER NOT NULL,
  synonyms TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  slug TEXT NOT NULL UNIQUE,
  propagation_state TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE videos (
  video_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL,
  duration_sec INTEGER NOT NULL,
  tag_ids TEXT[] NOT NULL
);

CREATE TABLE recheck_runs (
  recheck_run_id UUID PRIMARY KEY,
  run_id UUID NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ NULL,
  changed_count INTEGER NOT NULL DEFAULT 0,
  unchanged_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE publish_runs (
  publish_run_id UUID PRIMARY KEY,
  publish_type TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ NULL,
  triggered_by TEXT NOT NULL,
  rollback_executed BOOLEAN NOT NULL DEFAULT FALSE,
  rollback_to_version TEXT NULL,
  error_code TEXT NULL,
  error_message TEXT NULL,
  retryable BOOLEAN NOT NULL DEFAULT TRUE
);
