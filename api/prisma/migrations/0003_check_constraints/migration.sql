-- DD-APP-DB-004: CHECK constraints (DB層の最終防衛線)

-- channels
ALTER TABLE channels
  ADD CONSTRAINT chk_channels_channel_type
    CHECK (channel_type IN ('official', 'appearance'));

-- videos
ALTER TABLE videos
  ADD CONSTRAINT chk_videos_source_type
    CHECK (source_type IN ('official', 'appearance', 'supplement', 'incremental')),
  ADD CONSTRAINT chk_videos_validation_status
    CHECK (validation_status IN ('valid', 'invalid', 'needs_review')),
  ADD CONSTRAINT chk_videos_update_type
    CHECK (update_type IN ('new', 'existing', 'supplement', 'recheck'));

-- video_tags
ALTER TABLE video_tags
  ADD CONSTRAINT chk_video_tags_applied_by
    CHECK (applied_by IN ('system', 'operator')),
  ADD CONSTRAINT chk_video_tags_confidence
    CHECK (confidence >= 0 AND confidence <= 1);

-- ingestion_runs
ALTER TABLE ingestion_runs
  ADD CONSTRAINT chk_ingestion_runs_run_kind
    CHECK (run_kind IN ('official_ingestion', 'appearance_supplement', 'incremental_update')),
  ADD CONSTRAINT chk_ingestion_runs_status
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'partial', 'cancelled'));

-- ingestion_events
ALTER TABLE ingestion_events
  ADD CONSTRAINT chk_ingestion_events_event_status
    CHECK (event_status IN ('success', 'warn', 'failure'));

-- ingestion_items
ALTER TABLE ingestion_items
  ADD CONSTRAINT chk_ingestion_items_status
    CHECK (status IN ('succeeded', 'failed', 'unprocessed', 'excluded')),
  ADD CONSTRAINT chk_ingestion_items_source_type
    CHECK (source_type IN ('official', 'appearance', 'supplement', 'incremental'));

-- recheck_runs
ALTER TABLE recheck_runs
  ADD CONSTRAINT chk_recheck_runs_mode
    CHECK (mode IN ('before_delivery', 'after_delivery')),
  ADD CONSTRAINT chk_recheck_runs_status
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'partial', 'cancelled'));

-- recheck_items
ALTER TABLE recheck_items
  ADD CONSTRAINT chk_recheck_items_diff_status
    CHECK (diff_status IN ('changed', 'unchanged', 'failed', 'excluded'));

-- publish_runs
ALTER TABLE publish_runs
  ADD CONSTRAINT chk_publish_runs_publish_type
    CHECK (publish_type IN ('tag_master', 'archive', 'all', 'docs')),
  ADD CONSTRAINT chk_publish_runs_status
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'rolled_back', 'cancelled'));

-- publish_steps
ALTER TABLE publish_steps
  ADD CONSTRAINT chk_publish_steps_status
    CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'skipped'));

-- publish_artifacts
ALTER TABLE publish_artifacts
  ADD CONSTRAINT chk_publish_artifacts_validation_status
    CHECK (validation_status IN ('passed', 'failed', 'skipped'));
