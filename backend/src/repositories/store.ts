import { newId, nowIso, slugify } from "../lib/id.js";
import { ProblemError } from "../lib/problem.js";
import { PrismaClient } from "@prisma/client";
import type {
  IngestionItem,
  IngestionRun,
  PublishRun,
  RecheckRun,
  RunKind,
  RunStatus,
  TagRecord,
  TargetType,
  TriggerMode,
} from "../domain/types.js";

type IdempotencyRecord = {
  run_id: string;
  operator: string;
  endpoint: string;
  payload_hash: string;
  created_at: string;
};

type VideoRecord = {
  video_id: string;
  title: string;
  published_at: string;
  duration_sec: number;
  tag_ids: string[];
};

export class InMemoryStore {
  private prisma: PrismaClient | null;
  ingestionRuns = new Map<string, IngestionRun>();
  ingestionItems = new Map<string, IngestionItem[]>();
  recheckRuns = new Map<string, RecheckRun>();
  tags = new Map<string, TagRecord>();
  videos = new Map<string, VideoRecord>();
  publishRuns = new Map<string, PublishRun>();
  idempotency = new Map<string, IdempotencyRecord>();

  constructor() {
    this.prisma = process.env.DATABASE_URL ? new PrismaClient() : null;
    const now = nowIso();
    this.tags.set("tag-game", {
      tag_id: "tag-game",
      tag_name: "ゲーム",
      tag_type_id: 1,
      synonyms: ["配信ゲーム"],
      is_active: true,
      slug: "game",
      propagation_state: "published",
      updated_at: now,
    });

    this.tags.set("tag-chat", {
      tag_id: "tag-chat",
      tag_name: "雑談",
      tag_type_id: 1,
      synonyms: ["トーク"],
      is_active: true,
      slug: "chat",
      propagation_state: "published",
      updated_at: now,
    });

    this.videos.set("video-001", {
      video_id: "video-001",
      title: "初回アーカイブ",
      published_at: now,
      duration_sec: 3600,
      tag_ids: ["tag-game"],
    });

    const runId = newId();
    this.ingestionRuns.set(runId, {
      run_id: runId,
      accepted_at: now,
      started_at: now,
      finished_at: now,
      trigger_mode: "manual",
      run_kind: "official_ingestion",
      target_types: ["official"],
      status: "succeeded",
      parent_run_id: null,
      processed_count: 1,
      success_count: 1,
      failed_count: 0,
      error_summary: null,
    });

    this.ingestionItems.set(runId, [
      {
        run_id: runId,
        video_id: "video-001",
        source_type: "official",
        update_type: "new",
        status: "succeeded",
        error_code: null,
        error_message: null,
      },
    ]);
  }

  private async persist(sql: string, params: unknown[]): Promise<void> {
    if (!this.prisma) return;
    await this.prisma.$executeRawUnsafe(sql, ...params);
  }

  private async query<T>(sql: string, params: unknown[]): Promise<T[]> {
    if (!this.prisma) return [];
    return this.prisma.$queryRawUnsafe<T[]>(sql, ...params);
  }

  private hashPayload(payload: unknown): string {
    return JSON.stringify(payload);
  }

  private ensureNoActiveRun(runKind: RunKind): void {
    for (const run of this.ingestionRuns.values()) {
      if (run.run_kind === runKind && (run.status === "queued" || run.status === "running")) {
        throw new ProblemError({ status: 409, code: "RUN_ALREADY_ACTIVE", message: "Active run already exists" });
      }
    }
  }

  async createIngestionRun(input: {
    trigger_mode: TriggerMode;
    run_kind: RunKind;
    target_types: TargetType[];
    operator: string;
    endpoint: string;
    idempotency_key: string;
  }): Promise<IngestionRun> {
    const payloadHash = this.hashPayload({
      trigger_mode: input.trigger_mode,
      run_kind: input.run_kind,
      target_types: input.target_types,
    });

    const key = `${input.idempotency_key}:${input.operator}:${input.endpoint}:${payloadHash}`;
    const idem = this.idempotency.get(key);
    if (idem) {
      const existing = this.ingestionRuns.get(idem.run_id);
      if (!existing) {
        throw new ProblemError({ status: 500, code: "INTERNAL_ERROR", message: "Idempotency record is broken" });
      }
      return existing;
    }

    this.ensureNoActiveRun(input.run_kind);

    const now = nowIso();
    const run: IngestionRun = {
      run_id: newId(),
      accepted_at: now,
      started_at: null,
      finished_at: null,
      trigger_mode: input.trigger_mode,
      run_kind: input.run_kind,
      target_types: input.target_types,
      status: "queued",
      parent_run_id: null,
      processed_count: 0,
      success_count: 0,
      failed_count: 0,
      error_summary: null,
    };

    this.ingestionRuns.set(run.run_id, run);
    this.ingestionItems.set(run.run_id, []);
    this.idempotency.set(key, {
      run_id: run.run_id,
      operator: input.operator,
      endpoint: input.endpoint,
      payload_hash: payloadHash,
      created_at: now,
    });

    await this.persist(
      "INSERT INTO ingestion_runs (run_id, accepted_at, trigger_mode, run_kind, target_types, status, parent_run_id, processed_count, success_count, failed_count, error_summary) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (run_id) DO NOTHING",
      [run.run_id, run.accepted_at, run.trigger_mode, run.run_kind, run.target_types, run.status, run.parent_run_id, run.processed_count, run.success_count, run.failed_count, run.error_summary],
    );
    await this.persist(
      "INSERT INTO idempotency_keys (id, idem_key, operator, endpoint, payload_hash, run_id, created_at, expires_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (idem_key, operator, endpoint, payload_hash) DO NOTHING",
      [newId(), input.idempotency_key, input.operator, input.endpoint, payloadHash, run.run_id, now, new Date(Date.now() + 24 * 3600 * 1000).toISOString()],
    );
    return run;
  }

  async getIngestionRun(runId: string): Promise<IngestionRun> {
    const run = this.ingestionRuns.get(runId);
    if (run) {
      return run;
    }

    const rows = await this.query<Array<any>>(
      "SELECT run_id, accepted_at, started_at, finished_at, trigger_mode, run_kind, target_types, status, parent_run_id, processed_count, success_count, failed_count, error_summary FROM ingestion_runs WHERE run_id = $1 LIMIT 1",
      [runId],
    );
    const row = rows[0] as any;
    if (!row) {
      throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
    }

    const loaded: IngestionRun = {
      run_id: row.run_id,
      accepted_at: new Date(row.accepted_at).toISOString(),
      started_at: row.started_at ? new Date(row.started_at).toISOString() : null,
      finished_at: row.finished_at ? new Date(row.finished_at).toISOString() : null,
      trigger_mode: row.trigger_mode,
      run_kind: row.run_kind,
      target_types: row.target_types,
      status: row.status,
      parent_run_id: row.parent_run_id,
      processed_count: row.processed_count,
      success_count: row.success_count,
      failed_count: row.failed_count,
      error_summary: row.error_summary,
    };
    this.ingestionRuns.set(loaded.run_id, loaded);
    return loaded;
  }

  async getIngestionItems(runId: string): Promise<IngestionItem[]> {
    await this.getIngestionRun(runId);
    const local = this.ingestionItems.get(runId);
    if (local) return local;

    const rows = await this.query<Array<any>>(
      "SELECT run_id, video_id, source_type, update_type, status, error_code, error_message FROM ingestion_items WHERE run_id = $1",
      [runId],
    );

    return rows.map((row: any) => ({
      run_id: row.run_id,
      video_id: row.video_id,
      source_type: row.source_type,
      update_type: row.update_type,
      status: row.status,
      error_code: row.error_code,
      error_message: row.error_message,
    }));
  }

  async retryRun(parentRunId: string, operator: string, endpoint: string, idempotencyKey: string): Promise<IngestionRun> {
    const parent = await this.getIngestionRun(parentRunId);
    if (parent.status !== "failed") {
      throw new ProblemError({ status: 409, code: "RETRY_NOT_ALLOWED", message: "Retry is allowed only for failed runs" });
    }
    const payloadHash = this.hashPayload({ parent_run_id: parentRunId, run_kind: parent.run_kind });
    const idemKey = `${idempotencyKey}:${operator}:${endpoint}:${payloadHash}`;
    const idem = this.idempotency.get(idemKey);
    if (idem) {
      return this.getIngestionRun(idem.run_id);
    }

    const now = nowIso();
    const retry: IngestionRun = {
      run_id: newId(),
      accepted_at: now,
      started_at: null,
      finished_at: null,
      trigger_mode: "manual",
      run_kind: parent.run_kind,
      target_types: parent.target_types,
      status: "queued",
      parent_run_id: null,
      processed_count: 0,
      success_count: 0,
      failed_count: 0,
      error_summary: null,
    };

    retry.parent_run_id = parentRunId;
    this.ingestionRuns.set(retry.run_id, retry);
    this.ingestionItems.set(retry.run_id, []);
    this.idempotency.set(idemKey, {
      run_id: retry.run_id,
      operator,
      endpoint,
      payload_hash: payloadHash,
      created_at: now,
    });
    await this.persist(
      "INSERT INTO ingestion_runs (run_id, accepted_at, trigger_mode, run_kind, target_types, status, parent_run_id, processed_count, success_count, failed_count, error_summary) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (run_id) DO NOTHING",
      [retry.run_id, retry.accepted_at, retry.trigger_mode, retry.run_kind, retry.target_types, retry.status, retry.parent_run_id, retry.processed_count, retry.success_count, retry.failed_count, retry.error_summary],
    );
    return retry;
  }

  async latestIngestionSummary() {
    const latest = [...this.ingestionRuns.values()]
      .sort((a, b) => b.accepted_at.localeCompare(a.accepted_at))
      .find((v) => v.status === "succeeded");

    if (!latest && this.prisma) {
      const rows = await this.query<Array<any>>(
        "SELECT run_id, finished_at, target_types, success_count, failed_count FROM ingestion_runs WHERE status = 'succeeded' ORDER BY accepted_at DESC LIMIT 1",
        [],
      );
      const row = rows[0] as any;
      if (row) {
        const official = row.target_types.includes("official") ? row.success_count : 0;
        const appearance = row.target_types.includes("appearance") ? row.success_count : 0;
        return {
          last_success_at: row.finished_at ? new Date(row.finished_at).toISOString() : null,
          last_run_id: row.run_id,
          target_counts: {
            official,
            appearance,
            total: official + appearance,
          },
          warnings: row.failed_count > 0 ? ["FAILED_ITEMS_FOUND"] : [],
        };
      }
    }

    if (!latest) {
      return {
        last_success_at: null,
        last_run_id: null,
        target_counts: { official: 0, appearance: 0, total: 0 },
        warnings: ["NO_SUCCESSFUL_RUN"],
      };
    }

    const official = latest.target_types.includes("official") ? latest.success_count : 0;
    const appearance = latest.target_types.includes("appearance") ? latest.success_count : 0;

    return {
      last_success_at: latest.finished_at,
      last_run_id: latest.run_id,
      target_counts: {
        official,
        appearance,
        total: official + appearance,
      },
      warnings: latest.failed_count > 0 ? ["FAILED_ITEMS_FOUND"] : [],
    };
  }

  async diagnosticsHealth() {
    const latest = await this.latestIngestionSummary();
    const status: "ok" | "degraded" | "critical" = latest.warnings.length > 0 ? "degraded" : "ok";
    return {
      status,
      checks: {
        data_freshness: status,
        tag_master_consistency: "ok",
        archive_page_completeness: "ok",
        distribution_availability: "ok",
      },
    };
  }

  async createRecheckRun(runId: string): Promise<RecheckRun> {
    await this.getIngestionRun(runId);
    const recheck: RecheckRun = {
      recheck_run_id: newId(),
      run_id: runId,
      status: "queued",
      started_at: nowIso(),
      finished_at: null,
      diff_summary: { changed_count: 0, unchanged_count: 0 },
    };
    this.recheckRuns.set(recheck.recheck_run_id, recheck);
    await this.persist(
      "INSERT INTO recheck_runs (recheck_run_id, run_id, status, started_at, finished_at, changed_count, unchanged_count) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (recheck_run_id) DO NOTHING",
      [recheck.recheck_run_id, recheck.run_id, recheck.status, recheck.started_at, recheck.finished_at, recheck.diff_summary.changed_count, recheck.diff_summary.unchanged_count],
    );
    return recheck;
  }

  async getRecheckRun(recheckRunId: string): Promise<RecheckRun> {
    const run = this.recheckRuns.get(recheckRunId);
    if (run) return run;

    const rows = await this.query<Array<any>>(
      "SELECT recheck_run_id, run_id, status, started_at, finished_at, changed_count, unchanged_count FROM recheck_runs WHERE recheck_run_id = $1 LIMIT 1",
      [recheckRunId],
    );
    const row = rows[0] as any;
    if (!row) {
      throw new ProblemError({ status: 404, code: "RECHECK_RUN_NOT_FOUND", message: "Recheck run not found" });
    }

    return {
      recheck_run_id: row.recheck_run_id,
      run_id: row.run_id,
      status: row.status,
      started_at: new Date(row.started_at).toISOString(),
      finished_at: row.finished_at ? new Date(row.finished_at).toISOString() : null,
      diff_summary: { changed_count: row.changed_count, unchanged_count: row.unchanged_count },
    };
  }

  async createTag(input: { tag_name: string; tag_type_id: number; synonyms: string[]; is_active: boolean }): Promise<TagRecord> {
    const slug = slugify(input.tag_name);
    for (const tag of this.tags.values()) {
      if (tag.slug === slug) {
        throw new ProblemError({ status: 409, code: "TAG_SLUG_CONFLICT", message: "Tag slug conflict" });
      }
    }

    const tag: TagRecord = {
      tag_id: `tag-${newId().slice(0, 8)}`,
      tag_name: input.tag_name,
      tag_type_id: input.tag_type_id,
      synonyms: input.synonyms,
      is_active: input.is_active,
      slug,
      propagation_state: "pending_publish",
      updated_at: nowIso(),
    };
    this.tags.set(tag.tag_id, tag);
    await this.persist(
      "INSERT INTO tags (tag_id, tag_name, tag_type_id, synonyms, is_active, slug, propagation_state, updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (tag_id) DO NOTHING",
      [tag.tag_id, tag.tag_name, tag.tag_type_id, tag.synonyms, tag.is_active, tag.slug, tag.propagation_state, tag.updated_at],
    );
    return tag;
  }

  async updateTag(tagId: string, input: { tag_name?: string; synonyms?: string[]; is_active?: boolean }): Promise<TagRecord> {
    const tag = this.tags.get(tagId);
    if (!tag) {
      throw new ProblemError({ status: 404, code: "TAG_NOT_FOUND", message: "Tag not found" });
    }
    if (input.tag_name !== undefined) {
      tag.tag_name = input.tag_name;
      tag.slug = slugify(input.tag_name);
    }
    if (input.synonyms !== undefined) {
      tag.synonyms = input.synonyms;
    }
    if (input.is_active !== undefined) {
      tag.is_active = input.is_active;
    }
    tag.propagation_state = "pending_publish";
    tag.updated_at = nowIso();
    this.tags.set(tagId, tag);
    await this.persist(
      "UPDATE tags SET tag_name = $2, synonyms = $3, is_active = $4, slug = $5, propagation_state = $6, updated_at = $7 WHERE tag_id = $1",
      [tagId, tag.tag_name, tag.synonyms, tag.is_active, tag.slug, tag.propagation_state, tag.updated_at],
    );
    return tag;
  }

  async patchVideoTags(videoId: string, setIds: string[], unsetIds: string[]) {
    const video = this.videos.get(videoId);
    if (!video) {
      throw new ProblemError({ status: 404, code: "VIDEO_NOT_FOUND", message: "Video not found" });
    }
    const setSet = new Set(setIds);
    for (const id of unsetIds) {
      if (setSet.has(id)) {
        throw new ProblemError({ status: 400, code: "INVALID_TAG_OPERATION", message: "set/unset conflict" });
      }
    }
    const current = new Set(video.tag_ids);
    for (const id of [...setIds, ...unsetIds]) {
      if (!this.tags.has(id)) {
        throw new ProblemError({ status: 404, code: "TAG_NOT_FOUND", message: "Tag not found" });
      }
    }
    for (const id of setIds) current.add(id);
    for (const id of unsetIds) current.delete(id);
    video.tag_ids = [...current];
    this.videos.set(videoId, video);
    const response = {
      video_id: video.video_id,
      tag_ids: video.tag_ids,
      updated_at: nowIso(),
    };
    await this.persist("UPDATE videos SET tag_ids = $2 WHERE video_id = $1", [videoId, video.tag_ids]);
    return response;
  }

  async createPublishRun(type: "tag_master" | "archive" | "all" | "docs", triggeredBy: string): Promise<PublishRun> {
    const run: PublishRun = {
      publish_run_id: newId(),
      publish_type: type,
      status: "queued",
      started_at: nowIso(),
      finished_at: null,
      triggered_by: triggeredBy,
      rollback: { executed: false },
      error_code: null,
      error_message: null,
      retryable: true,
      steps: [
        { name: "generate", status: "queued" },
        { name: "validate", status: "queued" },
        { name: "switch", status: "queued" },
        { name: "post_check", status: "queued" },
      ],
    };
    this.publishRuns.set(run.publish_run_id, run);
    await this.persist(
      "INSERT INTO publish_runs (publish_run_id, publish_type, status, started_at, finished_at, triggered_by, rollback_executed, rollback_to_version, error_code, error_message, retryable) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT (publish_run_id) DO NOTHING",
      [run.publish_run_id, run.publish_type, run.status, run.started_at, run.finished_at, run.triggered_by, run.rollback.executed, run.rollback.rollback_to_version ?? null, run.error_code, run.error_message, run.retryable],
    );
    return run;
  }

  async getPublishRun(runId: string): Promise<PublishRun> {
    const run = this.publishRuns.get(runId);
    if (run) return run;

    const rows = await this.query<Array<any>>(
      "SELECT publish_run_id, publish_type, status, started_at, finished_at, triggered_by, rollback_executed, rollback_to_version, error_code, error_message, retryable FROM publish_runs WHERE publish_run_id = $1 LIMIT 1",
      [runId],
    );
    const row = rows[0] as any;
    if (!row) {
      throw new ProblemError({ status: 404, code: "PUBLISH_RUN_NOT_FOUND", message: "Publish run not found" });
    }

    return {
      publish_run_id: row.publish_run_id,
      publish_type: row.publish_type,
      status: row.status,
      started_at: new Date(row.started_at).toISOString(),
      finished_at: row.finished_at ? new Date(row.finished_at).toISOString() : null,
      triggered_by: row.triggered_by,
      rollback: { executed: row.rollback_executed, rollback_to_version: row.rollback_to_version ?? undefined },
      error_code: row.error_code,
      error_message: row.error_message,
      retryable: row.retryable,
      steps: [],
    };
  }

  async search(query: string) {
    const q = query.toLowerCase();
    const local = [...this.videos.values()];
    if (local.length > 0) {
      return local.filter((v) => v.title.toLowerCase().includes(q));
    }
    const rows = await this.query<Array<any>>(
      "SELECT video_id, title, published_at, duration_sec, tag_ids FROM videos WHERE lower(title) LIKE $1",
      [`%${q}%`],
    );
    return rows.map((v: any) => ({
      video_id: v.video_id,
      title: v.title,
      published_at: new Date(v.published_at).toISOString(),
      duration_sec: v.duration_sec,
      tag_ids: v.tag_ids,
    }));
  }

  async getVideo(videoId: string) {
    const video = this.videos.get(videoId);
    if (video) {
      return video;
    }
    const rows = await this.query<Array<any>>(
      "SELECT video_id, title, published_at, duration_sec, tag_ids FROM videos WHERE video_id = $1 LIMIT 1",
      [videoId],
    );
    const row = rows[0] as any;
    if (!row) {
      throw new ProblemError({ status: 404, code: "VIDEO_NOT_FOUND", message: "Video not found" });
    }
    return {
      video_id: row.video_id,
      title: row.title,
      published_at: new Date(row.published_at).toISOString(),
      duration_sec: row.duration_sec,
      tag_ids: row.tag_ids,
    };
  }

  async createTaggingPrompt(runId: string, videoIds: string[], includeFields: string[]) {
    await this.getIngestionRun(runId);
    const rows = await Promise.all(videoIds.map((id) => this.getVideo(id)));
    const lines = rows.map((v) => {
      const payload: Record<string, unknown> = { video_id: v.video_id };
      if (includeFields.includes("title")) payload.title = v.title;
      if (includeFields.includes("existingTags")) payload.existing_tags = v.tag_ids;
      return JSON.stringify(payload);
    });

    return {
      prompt_text: lines.join("\n"),
      prompt_version: "v1",
      video_count: rows.length,
      generated_at: nowIso(),
    };
  }

  async importTagging(items: Array<{ videoId: string; set: string[]; unset: string[]; reason: string }>) {
    let appliedCount = 0;
    const errors: Array<{ index: number; code: string; message: string; field?: string }> = [];

    for (const [index, item] of items.entries()) {
      try {
        await this.patchVideoTags(item.videoId, item.set, item.unset);
        appliedCount += 1;
      } catch (error) {
        if (error instanceof ProblemError) {
          errors.push({ index, code: error.code, message: error.message });
        } else {
          errors.push({ index, code: "INVALID_IMPORT_ITEM", message: "Unknown item error" });
        }
      }
    }

    const nextAction: "publish_required" | "no_change" = appliedCount > 0 ? "publish_required" : "no_change";
    return {
      import_run_id: newId(),
      validated_count: items.length,
      applied_count: appliedCount,
      rejected_count: items.length - appliedCount,
      errors,
      next_action: nextAction,
      publish_scope: appliedCount > 0 ? "all" : undefined,
    };
  }

  async publicContracts() {
    const tags = [...this.tags.values()].filter((v) => v.is_active);
    const videos = [...this.videos.values()];
    return {
      bootstrap: {
        schema_version: "v1",
        bootstrap_version: "v1",
        generated_at: nowIso(),
        tag_master_version: "v1",
        archive_version: "v1",
        tag_types: [{ id: 1, key: "genre", name: "ジャンル" }],
        tag_preview: tags.slice(0, 5).map((t) => [t.tag_id, t.tag_type_id, t.tag_name]),
        latest: videos.slice(0, 10).map((v) => [v.video_id, v.title, "", Math.floor(Date.now() / 1000), v.duration_sec, []]),
        next: {
          tag_master: { url: "tag_master.json" },
          archive_index: { url_pattern: "archive_index.p{page}.json", page_size: 50 },
        },
      },
      tag_master: {
        schema_version: "v1",
        tag_master_version: "v1",
        generated_at: nowIso(),
        tag_types: [{ id: 1, key: "genre", name: "ジャンル" }],
        tags: tags.map((t) => [t.tag_type_id, t.tag_name]),
      },
      archive_index: {
        schema_version: "v1",
        archive_version: "v1",
        tag_master_version: "v1",
        generated_at: nowIso(),
        page: 0,
        page_size: 50,
        total: videos.length,
        items: videos.map((v) => [v.video_id, v.title, "", Math.floor(Date.now() / 1000), v.duration_sec, []]),
      },
    };
  }
}

export const store = new InMemoryStore();

export const isRunStatus = (value: string): value is RunStatus =>
  ["queued", "running", "succeeded", "failed", "partial", "cancelled"].includes(value);
