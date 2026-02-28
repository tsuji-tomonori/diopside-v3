-- DD-APP-DB-004: CHECK constraints (DB層の最終防衛線)
-- NOTE: This migration is written to be idempotent because some constraints
-- were already introduced in 0001_init with the same names.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_channels_channel_type'
      AND conrelid = 'channels'::regclass
  ) THEN
    ALTER TABLE channels
      ADD CONSTRAINT chk_channels_channel_type
      CHECK (channel_type IN ('official', 'appearance'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_videos_source_type'
      AND conrelid = 'videos'::regclass
  ) THEN
    ALTER TABLE videos
      ADD CONSTRAINT chk_videos_source_type
      CHECK (source_type IN ('official', 'appearance', 'supplement', 'incremental'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_videos_validation_status'
      AND conrelid = 'videos'::regclass
  ) THEN
    ALTER TABLE videos
      ADD CONSTRAINT chk_videos_validation_status
      CHECK (validation_status IN ('valid', 'invalid', 'needs_review'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_videos_update_type'
      AND conrelid = 'videos'::regclass
  ) THEN
    ALTER TABLE videos
      ADD CONSTRAINT chk_videos_update_type
      CHECK (update_type IN ('new', 'existing', 'supplement', 'recheck'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_video_tags_applied_by'
      AND conrelid = 'video_tags'::regclass
  ) THEN
    ALTER TABLE video_tags
      ADD CONSTRAINT chk_video_tags_applied_by
      CHECK (applied_by IN ('system', 'operator'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_video_tags_confidence'
      AND conrelid = 'video_tags'::regclass
  ) THEN
    ALTER TABLE video_tags
      ADD CONSTRAINT chk_video_tags_confidence
      CHECK (confidence >= 0 AND confidence <= 1);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_ingestion_runs_run_kind'
      AND conrelid = 'ingestion_runs'::regclass
  ) THEN
    ALTER TABLE ingestion_runs
      ADD CONSTRAINT chk_ingestion_runs_run_kind
      CHECK (run_kind IN ('official_ingestion', 'appearance_supplement', 'incremental_update'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_ingestion_runs_status'
      AND conrelid = 'ingestion_runs'::regclass
  ) THEN
    ALTER TABLE ingestion_runs
      ADD CONSTRAINT chk_ingestion_runs_status
      CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'partial', 'cancelled'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_ingestion_events_event_status'
      AND conrelid = 'ingestion_events'::regclass
  ) THEN
    ALTER TABLE ingestion_events
      ADD CONSTRAINT chk_ingestion_events_event_status
      CHECK (event_status IN ('success', 'warn', 'failure'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_ingestion_items_status'
      AND conrelid = 'ingestion_items'::regclass
  ) THEN
    ALTER TABLE ingestion_items
      ADD CONSTRAINT chk_ingestion_items_status
      CHECK (status IN ('succeeded', 'failed', 'unprocessed', 'excluded'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_ingestion_items_source_type'
      AND conrelid = 'ingestion_items'::regclass
  ) THEN
    ALTER TABLE ingestion_items
      ADD CONSTRAINT chk_ingestion_items_source_type
      CHECK (source_type IN ('official', 'appearance', 'supplement', 'incremental'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_recheck_runs_mode'
      AND conrelid = 'recheck_runs'::regclass
  ) THEN
    ALTER TABLE recheck_runs
      ADD CONSTRAINT chk_recheck_runs_mode
      CHECK (mode IN ('before_delivery', 'after_delivery'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_recheck_runs_status'
      AND conrelid = 'recheck_runs'::regclass
  ) THEN
    ALTER TABLE recheck_runs
      ADD CONSTRAINT chk_recheck_runs_status
      CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'partial', 'cancelled'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_recheck_items_diff_status'
      AND conrelid = 'recheck_items'::regclass
  ) THEN
    ALTER TABLE recheck_items
      ADD CONSTRAINT chk_recheck_items_diff_status
      CHECK (diff_status IN ('changed', 'unchanged', 'failed', 'excluded'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_publish_runs_publish_type'
      AND conrelid = 'publish_runs'::regclass
  ) THEN
    ALTER TABLE publish_runs
      ADD CONSTRAINT chk_publish_runs_publish_type
      CHECK (publish_type IN ('tag_master', 'archive', 'all', 'docs'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_publish_runs_status'
      AND conrelid = 'publish_runs'::regclass
  ) THEN
    ALTER TABLE publish_runs
      ADD CONSTRAINT chk_publish_runs_status
      CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'rolled_back', 'cancelled'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_publish_steps_status'
      AND conrelid = 'publish_steps'::regclass
  ) THEN
    ALTER TABLE publish_steps
      ADD CONSTRAINT chk_publish_steps_status
      CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'skipped'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_publish_artifacts_validation_status'
      AND conrelid = 'publish_artifacts'::regclass
  ) THEN
    ALTER TABLE publish_artifacts
      ADD CONSTRAINT chk_publish_artifacts_validation_status
      CHECK (validation_status IN ('passed', 'failed', 'skipped'));
  END IF;
END $$;
