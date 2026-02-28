export type RunStatus = "queued" | "running" | "succeeded" | "failed" | "partial" | "cancelled";
export type PublishStatus = RunStatus | "rolled_back";

export type TriggerMode = "manual" | "scheduled";
export type RunKind = "official_ingestion" | "appearance_supplement" | "incremental_update";
export type TargetType = "official" | "appearance";

export type IngestionRun = {
  run_id: string;
  accepted_at: string;
  started_at: string | null;
  finished_at: string | null;
  trigger_mode: TriggerMode;
  run_kind: RunKind;
  target_types: TargetType[];
  status: RunStatus;
  parent_run_id: string | null;
  processed_count: number;
  success_count: number;
  failed_count: number;
  error_summary: string | null;
};

export type IngestionItem = {
  run_id: string;
  video_id: string;
  source_type: TargetType;
  update_type: "new" | "existing" | "backfill" | "recheck";
  status: "succeeded" | "failed";
  error_code: string | null;
  error_message: string | null;
};

export type RecheckRun = {
  recheck_run_id: string;
  run_id: string;
  status: RunStatus;
  started_at: string;
  finished_at: string | null;
  diff_summary: {
    changed_count: number;
    unchanged_count: number;
  };
};

export type TagRecord = {
  tag_id: string;
  tag_name: string;
  tag_type_id: number;
  synonyms: string[];
  is_active: boolean;
  slug: string;
  propagation_state: "pending_publish" | "published";
  updated_at: string;
};

export type PublishRun = {
  publish_run_id: string;
  publish_type: "tag_master" | "archive" | "all" | "docs";
  status: PublishStatus;
  started_at: string;
  finished_at: string | null;
  triggered_by: string;
  rollback: {
    executed: boolean;
    rollback_to_version?: string;
  };
  error_code: string | null;
  error_message: string | null;
  retryable: boolean;
  steps: Array<{
    name: "generate" | "validate" | "switch" | "post_check";
    status: PublishStatus;
  }>;
};
