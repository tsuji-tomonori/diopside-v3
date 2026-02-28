CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE channels (
  channel_id varchar(64) PRIMARY KEY,
  channel_name varchar(255) NOT NULL,
  channel_type varchar(16) NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  last_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_channels_type CHECK (channel_type IN ('official', 'appearance'))
);

CREATE TABLE videos (
  video_id varchar(32) PRIMARY KEY,
  channel_id varchar(64) NOT NULL,
  title varchar(255) NOT NULL,
  published_at timestamptz NOT NULL,
  duration_sec integer,
  description text,
  thumbnail_url text,
  source_type varchar(16) NOT NULL,
  update_type varchar(16) NOT NULL,
  validation_status varchar(16) NOT NULL,
  missing_fields text[] DEFAULT '{}',
  supplement_required boolean NOT NULL DEFAULT false,
  normalized_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_videos_channel FOREIGN KEY (channel_id)
    REFERENCES channels(channel_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT chk_videos_source_type CHECK (source_type IN ('official', 'appearance', 'supplement', 'incremental')),
  CONSTRAINT chk_videos_update_type CHECK (update_type IN ('new', 'existing', 'supplement', 'recheck')),
  CONSTRAINT chk_videos_validation_status CHECK (validation_status IN ('valid', 'invalid', 'needs_review')),
  CONSTRAINT chk_videos_duration_non_negative CHECK (duration_sec IS NULL OR duration_sec >= 0)
);

CREATE TABLE tag_types (
  tag_type_id varchar(32) PRIMARY KEY,
  display_name varchar(128) NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_tag_types_display_name UNIQUE (display_name)
);

CREATE TABLE tags (
  tag_id varchar(64) PRIMARY KEY,
  tag_type_id varchar(32) NOT NULL,
  tag_name varchar(128) NOT NULL,
  tag_slug varchar(128) NOT NULL,
  synonyms text[] DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_tags_slug UNIQUE (tag_slug),
  CONSTRAINT fk_tags_tag_type FOREIGN KEY (tag_type_id)
    REFERENCES tag_types(tag_type_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT
);

CREATE TABLE video_tags (
  video_id varchar(32) NOT NULL,
  tag_id varchar(64) NOT NULL,
  applied_by varchar(16) NOT NULL,
  confidence numeric(5, 4),
  applied_at timestamptz NOT NULL DEFAULT now(),
  removed_at timestamptz,
  CONSTRAINT pk_video_tags PRIMARY KEY (video_id, tag_id),
  CONSTRAINT fk_video_tags_video FOREIGN KEY (video_id)
    REFERENCES videos(video_id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT fk_video_tags_tag FOREIGN KEY (tag_id)
    REFERENCES tags(tag_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT chk_video_tags_applied_by CHECK (applied_by IN ('system', 'operator')),
  CONSTRAINT chk_video_tags_confidence CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))
);

CREATE TABLE ingestion_runs (
  run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_kind varchar(32) NOT NULL,
  mode varchar(16) NOT NULL,
  status varchar(16) NOT NULL,
  target_types text[] NOT NULL,
  parent_run_id uuid,
  requested_by varchar(64),
  started_at timestamptz,
  finished_at timestamptz,
  target_count integer NOT NULL DEFAULT 0,
  processed_count integer NOT NULL DEFAULT 0,
  success_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  unprocessed_count integer NOT NULL DEFAULT 0,
  trace_id varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_ingestion_runs_parent FOREIGN KEY (parent_run_id)
    REFERENCES ingestion_runs(run_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT chk_ingestion_runs_run_kind CHECK (run_kind IN ('official_ingestion', 'appearance_supplement', 'incremental_update')),
  CONSTRAINT chk_ingestion_runs_mode CHECK (mode IN ('manual', 'scheduled')),
  CONSTRAINT chk_ingestion_runs_status CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'partial', 'cancelled')),
  CONSTRAINT chk_ingestion_runs_counts_non_negative CHECK (
    target_count >= 0 AND processed_count >= 0 AND success_count >= 0 AND failed_count >= 0 AND unprocessed_count >= 0
  ),
  CONSTRAINT chk_ingestion_runs_time_consistency CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE ingestion_events (
  event_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL,
  event_type varchar(32) NOT NULL,
  event_status varchar(16) NOT NULL,
  target_id varchar(64),
  error_code varchar(64),
  message text NOT NULL,
  occurred_at timestamptz NOT NULL,
  trace_id varchar(64) NOT NULL,
  CONSTRAINT fk_ingestion_events_run FOREIGN KEY (run_id)
    REFERENCES ingestion_runs(run_id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT chk_ingestion_events_type CHECK (event_type IN ('fetch', 'normalize', 'publish', 'retry')),
  CONSTRAINT chk_ingestion_events_status CHECK (event_status IN ('success', 'warn', 'failure'))
);

CREATE TABLE ingestion_items (
  item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL,
  video_id varchar(32) NOT NULL,
  status varchar(16) NOT NULL,
  failure_reason_code varchar(64),
  failure_scope varchar(32),
  update_type varchar(16) NOT NULL,
  source_type varchar(16) NOT NULL,
  processed_at timestamptz,
  trace_id varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_ingestion_items_run FOREIGN KEY (run_id)
    REFERENCES ingestion_runs(run_id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT fk_ingestion_items_video FOREIGN KEY (video_id)
    REFERENCES videos(video_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT uq_ingestion_items_run_video UNIQUE (run_id, video_id),
  CONSTRAINT chk_ingestion_items_status CHECK (status IN ('succeeded', 'failed', 'unprocessed', 'excluded')),
  CONSTRAINT chk_ingestion_items_failure_scope CHECK (
    failure_scope IS NULL OR failure_scope IN ('fetch', 'normalize', 'validate', 'publish')
  ),
  CONSTRAINT chk_ingestion_items_update_type CHECK (update_type IN ('new', 'existing', 'supplement', 'recheck')),
  CONSTRAINT chk_ingestion_items_source_type CHECK (source_type IN ('official', 'appearance', 'supplement', 'incremental')),
  CONSTRAINT chk_ingestion_items_failed_reason CHECK (
    status <> 'failed' OR failure_reason_code IS NOT NULL
  )
);

CREATE TABLE recheck_runs (
  recheck_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_run_id uuid,
  mode varchar(32) NOT NULL,
  status varchar(16) NOT NULL,
  requested_by varchar(64),
  total_count integer NOT NULL DEFAULT 0,
  changed_count integer NOT NULL DEFAULT 0,
  unchanged_count integer NOT NULL DEFAULT 0,
  failed_count integer NOT NULL DEFAULT 0,
  started_at timestamptz,
  finished_at timestamptz,
  trace_id varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_recheck_runs_base_run FOREIGN KEY (base_run_id)
    REFERENCES ingestion_runs(run_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT chk_recheck_runs_mode CHECK (mode IN ('before_delivery', 'after_delivery')),
  CONSTRAINT chk_recheck_runs_status CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'partial', 'cancelled')),
  CONSTRAINT chk_recheck_runs_counts_non_negative CHECK (
    total_count >= 0 AND changed_count >= 0 AND unchanged_count >= 0 AND failed_count >= 0
  ),
  CONSTRAINT chk_recheck_runs_time_consistency CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE recheck_items (
  recheck_item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recheck_run_id uuid NOT NULL,
  video_id varchar(32) NOT NULL,
  diff_status varchar(16) NOT NULL,
  diff_fields text[] DEFAULT '{}',
  reason text,
  compared_at timestamptz,
  trace_id varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_recheck_items_run FOREIGN KEY (recheck_run_id)
    REFERENCES recheck_runs(recheck_run_id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT fk_recheck_items_video FOREIGN KEY (video_id)
    REFERENCES videos(video_id)
    ON UPDATE RESTRICT ON DELETE RESTRICT,
  CONSTRAINT uq_recheck_items_run_video UNIQUE (recheck_run_id, video_id),
  CONSTRAINT chk_recheck_items_diff_status CHECK (diff_status IN ('changed', 'unchanged', 'failed', 'excluded')),
  CONSTRAINT chk_recheck_items_changed_fields CHECK (
    diff_status <> 'changed' OR coalesce(array_length(diff_fields, 1), 0) > 0
  ),
  CONSTRAINT chk_recheck_items_reason_required CHECK (
    (diff_status IN ('failed', 'excluded') AND reason IS NOT NULL) OR
    (diff_status IN ('changed', 'unchanged'))
  )
);

CREATE TABLE publish_runs (
  publish_run_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_run_id uuid,
  publish_type varchar(16) NOT NULL,
  trigger_type varchar(16) NOT NULL,
  status varchar(16) NOT NULL,
  triggered_by varchar(64),
  started_at timestamptz,
  finished_at timestamptz,
  published_at timestamptz,
  rollback_executed boolean NOT NULL DEFAULT false,
  rollback_to_version varchar(64),
  error_code varchar(64),
  error_message text,
  retryable boolean NOT NULL DEFAULT false,
  trace_id varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_runs_source_run FOREIGN KEY (source_run_id)
    REFERENCES ingestion_runs(run_id)
    ON UPDATE RESTRICT ON DELETE SET NULL,
  CONSTRAINT chk_publish_runs_publish_type CHECK (publish_type IN ('tag_master', 'archive', 'all', 'docs')),
  CONSTRAINT chk_publish_runs_trigger_type CHECK (trigger_type IN ('manual', 'scheduled')),
  CONSTRAINT chk_publish_runs_status CHECK (
    status IN ('queued', 'running', 'rollback_pending', 'succeeded', 'failed', 'rolled_back', 'cancelled')
  ),
  CONSTRAINT chk_publish_runs_rollback_consistency CHECK (
    (rollback_executed = true AND status = 'rolled_back') OR
    (rollback_executed = false)
  ),
  CONSTRAINT chk_publish_runs_time_consistency CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE publish_steps (
  publish_step_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publish_run_id uuid NOT NULL,
  step_name varchar(32) NOT NULL,
  status varchar(16) NOT NULL,
  started_at timestamptz,
  finished_at timestamptz,
  error_code varchar(64),
  error_message text,
  trace_id varchar(64) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_steps_run FOREIGN KEY (publish_run_id)
    REFERENCES publish_runs(publish_run_id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT uq_publish_steps_run_name UNIQUE (publish_run_id, step_name),
  CONSTRAINT chk_publish_steps_name CHECK (
    step_name IN (
      'generate',
      'validate',
      'switch',
      'post_check',
      'docs_link_check',
      'quartz_build',
      'cdk_deploy',
      'invalidation',
      'rollback_prepare',
      'rollback_switch',
      'rollback_verify'
    )
  ),
  CONSTRAINT chk_publish_steps_status CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'skipped')),
  CONSTRAINT chk_publish_steps_failed_error_code CHECK (status <> 'failed' OR error_code IS NOT NULL),
  CONSTRAINT chk_publish_steps_time_consistency CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE publish_artifacts (
  artifact_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publish_run_id uuid NOT NULL,
  artifact_type varchar(32) NOT NULL,
  artifact_path text NOT NULL,
  checksum varchar(128) NOT NULL,
  record_count integer,
  generated_at timestamptz NOT NULL,
  validation_status varchar(16) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_publish_artifacts_run FOREIGN KEY (publish_run_id)
    REFERENCES publish_runs(publish_run_id)
    ON UPDATE RESTRICT ON DELETE CASCADE,
  CONSTRAINT uq_publish_artifacts_run_type UNIQUE (publish_run_id, artifact_type),
  CONSTRAINT chk_publish_artifacts_type CHECK (
    artifact_type IN ('bootstrap', 'tag_master', 'archive_index', 'highlights', 'wordcloud', 'docs', 'openapi')
  ),
  CONSTRAINT chk_publish_artifacts_validation_status CHECK (validation_status IN ('passed', 'failed', 'skipped')),
  CONSTRAINT chk_publish_artifacts_record_count_non_negative CHECK (record_count IS NULL OR record_count >= 0)
);

CREATE INDEX idx_channels_type_active ON channels (channel_type, is_active);
CREATE INDEX idx_channels_last_seen_at ON channels (last_seen_at DESC);

CREATE INDEX idx_videos_published_at ON videos (published_at DESC);
CREATE INDEX idx_videos_channel_published ON videos (channel_id, published_at DESC);
CREATE INDEX idx_videos_source_update ON videos (source_type, update_type);
CREATE INDEX idx_videos_validation_status ON videos (validation_status, supplement_required);

CREATE INDEX idx_tag_types_active_order ON tag_types (is_active, sort_order);

CREATE INDEX idx_tags_type_active_order ON tags (tag_type_id, is_active, sort_order);
CREATE INDEX idx_tags_name ON tags (tag_name);

CREATE INDEX idx_video_tags_tag_id ON video_tags (tag_id);
CREATE INDEX idx_video_tags_applied_at ON video_tags (applied_at DESC);
CREATE INDEX idx_video_tags_active ON video_tags (video_id, removed_at);

CREATE INDEX idx_ingestion_runs_status_created ON ingestion_runs (status, created_at DESC);
CREATE INDEX idx_ingestion_runs_started_at ON ingestion_runs (started_at DESC);
CREATE INDEX idx_ingestion_runs_trace_id ON ingestion_runs (trace_id);

CREATE INDEX idx_ingestion_events_run_time ON ingestion_events (run_id, occurred_at);
CREATE INDEX idx_ingestion_events_status ON ingestion_events (event_status, occurred_at DESC);
CREATE INDEX idx_ingestion_events_trace_id ON ingestion_events (trace_id);

CREATE INDEX idx_ingestion_items_run_status ON ingestion_items (run_id, status);
CREATE INDEX idx_ingestion_items_video ON ingestion_items (video_id, created_at DESC);
CREATE INDEX idx_ingestion_items_trace_id ON ingestion_items (trace_id);

CREATE INDEX idx_recheck_runs_status_created ON recheck_runs (status, created_at DESC);
CREATE INDEX idx_recheck_runs_mode_created ON recheck_runs (mode, created_at DESC);
CREATE INDEX idx_recheck_runs_base_run ON recheck_runs (base_run_id);

CREATE INDEX idx_recheck_items_run_status ON recheck_items (recheck_run_id, diff_status);
CREATE INDEX idx_recheck_items_video ON recheck_items (video_id, created_at DESC);
CREATE INDEX idx_recheck_items_compared_at ON recheck_items (compared_at DESC);

CREATE INDEX idx_publish_runs_status_created ON publish_runs (status, created_at DESC);
CREATE INDEX idx_publish_runs_type_created ON publish_runs (publish_type, created_at DESC);
CREATE INDEX idx_publish_runs_source_run ON publish_runs (source_run_id);
CREATE INDEX idx_publish_runs_trace_id ON publish_runs (trace_id);

CREATE INDEX idx_publish_steps_run_order ON publish_steps (publish_run_id, created_at);
CREATE INDEX idx_publish_steps_run_status ON publish_steps (publish_run_id, status);
CREATE INDEX idx_publish_steps_name_status ON publish_steps (step_name, status);

CREATE INDEX idx_publish_artifacts_run_type ON publish_artifacts (publish_run_id, artifact_type);
CREATE INDEX idx_publish_artifacts_checksum ON publish_artifacts (checksum);
CREATE INDEX idx_publish_artifacts_generated_at ON publish_artifacts (generated_at DESC);
