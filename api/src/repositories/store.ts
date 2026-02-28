import { newId, nowIso, slugify } from "../lib/id.js";
import { ProblemError } from "../lib/problem.js";
import { PrismaClient } from "@prisma/client";
import type {
  IngestionItem,
  IngestionRun,
  PublishStatus,
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
  private testFaults = {
    ingestion_fail: false,
    archive_missing: false,
    tag_master_inconsistent: false,
    distribution_down: false,
    publish_fail: false,
  };
  ingestionRuns = new Map<string, IngestionRun>();
  ingestionItems = new Map<string, IngestionItem[]>();
  recheckRuns = new Map<string, RecheckRun>();
  tags = new Map<string, TagRecord>();
  videos = new Map<string, VideoRecord>();
  publishRuns = new Map<string, PublishRun>();
  idempotency = new Map<string, IdempotencyRecord>();

  constructor() {
    this.prisma = process.env.DATABASE_URL ? new PrismaClient() : null;
    this.seedDefaults();
  }

  private seedDefaults() {
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

  resetForTest() {
    this.ingestionRuns.clear();
    this.ingestionItems.clear();
    this.recheckRuns.clear();
    this.tags.clear();
    this.videos.clear();
    this.publishRuns.clear();
    this.idempotency.clear();
    this.testFaults = {
      ingestion_fail: false,
      archive_missing: false,
      tag_master_inconsistent: false,
      distribution_down: false,
      publish_fail: false,
    };
    this.seedDefaults();
  }

  setTestFaults(input: Partial<typeof this.testFaults>) {
    this.testFaults = { ...this.testFaults, ...input };
    return this.testFaults;
  }

  getTestFaults() {
    return this.testFaults;
  }

  async setRunStatusForTest(
    runId: string,
    input: {
      status: RunStatus;
      processed_count?: number;
      success_count?: number;
      failed_count?: number;
      error_summary?: string | null;
      finished?: boolean;
      item_status?: "succeeded" | "failed";
    },
  ): Promise<IngestionRun> {
    const run = await this.getIngestionRun(runId);
    run.status = input.status;
    if (input.processed_count !== undefined) run.processed_count = input.processed_count;
    if (input.success_count !== undefined) run.success_count = input.success_count;
    if (input.failed_count !== undefined) run.failed_count = input.failed_count;
    if (input.error_summary !== undefined) run.error_summary = input.error_summary;
    if (run.started_at === null) run.started_at = nowIso();
    if (input.finished || input.status === "succeeded" || input.status === "failed" || input.status === "partial" || input.status === "cancelled") {
      run.finished_at = nowIso();
    }

    if (this.ingestionItems.get(runId)?.length === 0) {
      const sourceType: TargetType = run.target_types.includes("appearance") ? "appearance" : "official";
      const itemStatus = input.item_status ?? (input.status === "failed" ? "failed" : "succeeded");
      this.ingestionItems.set(runId, [
        {
          run_id: runId,
          video_id: "video-001",
          source_type: sourceType,
          update_type: run.run_kind === "incremental_update" ? "existing" : "new",
          status: itemStatus,
          error_code: itemStatus === "failed" ? "NORMALIZE_FAILED" : null,
          error_message: itemStatus === "failed" ? "simulated ingestion failure" : null,
        },
      ]);
    }

    this.ingestionRuns.set(runId, run);
    await this.upsertIngestionRunToDb(run);
    return run;
  }

  async setPublishStatusForTest(
    runId: string,
    input: {
      status: PublishStatus;
      finished?: boolean;
      error_code?: string | null;
      error_message?: string | null;
      retryable?: boolean;
    },
  ): Promise<PublishRun> {
    const run = await this.getPublishRun(runId);
    run.status = input.status;
    if (input.error_code !== undefined) run.error_code = input.error_code;
    if (input.error_message !== undefined) run.error_message = input.error_message;
    if (input.retryable !== undefined) run.retryable = input.retryable;
    if (input.finished || input.status === "succeeded" || input.status === "failed" || input.status === "partial" || input.status === "cancelled" || input.status === "rolled_back") {
      run.finished_at = nowIso();
    }
    run.steps = run.steps.map((step) => ({ ...step, status: input.status }));

    if (run.status === "succeeded") {
      for (const tag of this.tags.values()) {
        tag.propagation_state = "published";
      }
    }

    this.publishRuns.set(runId, run);
    await this.upsertPublishRunToDb(run);
    return run;
  }

  private async dbWrite(operation: () => Promise<void>): Promise<void> {
    if (!this.prisma) return;
    try {
      await operation();
    } catch {
      if (process.env.E2E_TEST_MODE === "1") return;
      throw new ProblemError({ status: 500, code: "DB_WRITE_FAILED", message: "Database write failed" });
    }
  }

  private async dbRead<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
    if (!this.prisma) return fallback;
    try {
      return await operation();
    } catch {
      if (process.env.E2E_TEST_MODE === "1") return fallback;
      throw new ProblemError({ status: 500, code: "DB_READ_FAILED", message: "Database read failed" });
    }
  }

  async dbMetricsForTest() {
    if (!this.prisma) {
      return {
        connected: false,
        ingestion_runs: 0,
        publish_runs: 0,
        recheck_runs: 0,
      };
    }

    try {
      const [ingestionRuns, publishRuns, recheckRuns] = await Promise.all([
        this.prisma.ingestionRun.count(),
        this.prisma.publishRun.count(),
        this.prisma.recheckRun.count(),
      ]);
      return {
        connected: true,
        ingestion_runs: ingestionRuns,
        publish_runs: publishRuns,
        recheck_runs: recheckRuns,
      };
    } catch {
      return {
        connected: false,
        ingestion_runs: 0,
        publish_runs: 0,
        recheck_runs: 0,
      };
    }
  }

  private async upsertIngestionRunToDb(run: IngestionRun, requestedBy: string | null = null) {
    if (!this.prisma) return;
    await this.prisma.ingestionRun.upsert({
      where: { run_id: run.run_id },
      create: {
        run_id: run.run_id,
        run_kind: run.run_kind,
        mode: run.trigger_mode,
        status: run.status,
        target_types: run.target_types,
        parent_run_id: run.parent_run_id,
        requested_by: requestedBy,
        started_at: run.started_at ? new Date(run.started_at) : null,
        finished_at: run.finished_at ? new Date(run.finished_at) : null,
        target_count: run.processed_count,
        processed_count: run.processed_count,
        success_count: run.success_count,
        failed_count: run.failed_count,
        unprocessed_count: 0,
        trace_id: `trace-${run.run_id.slice(0, 12)}`,
      },
      update: {
        status: run.status,
        parent_run_id: run.parent_run_id,
        started_at: run.started_at ? new Date(run.started_at) : null,
        finished_at: run.finished_at ? new Date(run.finished_at) : null,
        target_count: run.processed_count,
        processed_count: run.processed_count,
        success_count: run.success_count,
        failed_count: run.failed_count,
        requested_by: requestedBy,
      },
    });
  }

  private mapDbIngestionRun(row: {
    run_id: string;
    created_at: Date;
    started_at: Date | null;
    finished_at: Date | null;
    mode: string;
    run_kind: string;
    target_types: string[];
    status: string;
    parent_run_id: string | null;
    processed_count: number;
    success_count: number;
    failed_count: number;
  }): IngestionRun {
    return {
      run_id: row.run_id,
      accepted_at: row.created_at.toISOString(),
      started_at: row.started_at ? row.started_at.toISOString() : null,
      finished_at: row.finished_at ? row.finished_at.toISOString() : null,
      trigger_mode: row.mode as TriggerMode,
      run_kind: row.run_kind as RunKind,
      target_types: row.target_types as TargetType[],
      status: row.status as RunStatus,
      parent_run_id: row.parent_run_id,
      processed_count: row.processed_count,
      success_count: row.success_count,
      failed_count: row.failed_count,
      error_summary: null,
    };
  }

  private async upsertPublishRunToDb(run: PublishRun) {
    if (!this.prisma) return;
    await this.prisma.publishRun.upsert({
      where: { publish_run_id: run.publish_run_id },
      create: {
        publish_run_id: run.publish_run_id,
        source_run_id: null,
        publish_type: run.publish_type,
        trigger_type: "manual",
        status: run.status,
        triggered_by: run.triggered_by,
        started_at: run.started_at ? new Date(run.started_at) : null,
        finished_at: run.finished_at ? new Date(run.finished_at) : null,
        published_at: null,
        rollback_executed: run.rollback.executed,
        rollback_to_version: run.rollback.rollback_to_version ?? null,
        error_code: run.error_code,
        error_message: run.error_message,
        retryable: run.retryable,
        trace_id: `trace-${run.publish_run_id.slice(0, 12)}`,
      },
      update: {
        status: run.status,
        triggered_by: run.triggered_by,
        started_at: run.started_at ? new Date(run.started_at) : null,
        finished_at: run.finished_at ? new Date(run.finished_at) : null,
        rollback_executed: run.rollback.executed,
        rollback_to_version: run.rollback.rollback_to_version ?? null,
        error_code: run.error_code,
        error_message: run.error_message,
        retryable: run.retryable,
      },
    });
  }

  private async upsertRecheckRunToDb(run: RecheckRun) {
    if (!this.prisma) return;
    await this.prisma.recheckRun.upsert({
      where: { recheck_run_id: run.recheck_run_id },
      create: {
        recheck_run_id: run.recheck_run_id,
        base_run_id: run.run_id,
        mode: "before_delivery",
        status: run.status,
        requested_by: "admin",
        total_count: run.diff_summary.changed_count + run.diff_summary.unchanged_count,
        changed_count: run.diff_summary.changed_count,
        unchanged_count: run.diff_summary.unchanged_count,
        failed_count: 0,
        started_at: run.started_at ? new Date(run.started_at) : null,
        finished_at: run.finished_at ? new Date(run.finished_at) : null,
        trace_id: `trace-${run.recheck_run_id.slice(0, 12)}`,
      },
      update: {
        status: run.status,
        total_count: run.diff_summary.changed_count + run.diff_summary.unchanged_count,
        changed_count: run.diff_summary.changed_count,
        unchanged_count: run.diff_summary.unchanged_count,
        started_at: run.started_at ? new Date(run.started_at) : null,
        finished_at: run.finished_at ? new Date(run.finished_at) : null,
      },
    });
  }

  private hashPayload(payload: unknown): string {
    return JSON.stringify(payload);
  }

  private async upsertIdempotencyKeyToDb(input: {
    idem_key: string;
    operator: string;
    endpoint: string;
    payload_hash: string;
    run_id: string;
    created_at: string;
  }) {
    await this.dbWrite(async () => {
      await this.prisma!.idempotencyKey.upsert({
        where: {
          idem_key_operator_endpoint_payload_hash: {
            idem_key: input.idem_key,
            operator: input.operator,
            endpoint: input.endpoint,
            payload_hash: input.payload_hash,
          },
        },
        create: {
          id: newId(),
          idem_key: input.idem_key,
          operator: input.operator,
          endpoint: input.endpoint,
          payload_hash: input.payload_hash,
          run_id: input.run_id,
          created_at: new Date(input.created_at),
          expires_at: new Date(Date.now() + 24 * 3600 * 1000),
        },
        update: {
          run_id: input.run_id,
          expires_at: new Date(Date.now() + 24 * 3600 * 1000),
        },
      });
    });
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

    await this.upsertIngestionRunToDb(run, input.operator);
    await this.upsertIdempotencyKeyToDb({
      idem_key: input.idempotency_key,
      operator: input.operator,
      endpoint: input.endpoint,
      payload_hash: payloadHash,
      run_id: run.run_id,
      created_at: now,
    });
    return run;
  }

  async getIngestionRun(runId: string): Promise<IngestionRun> {
    const run = this.ingestionRuns.get(runId);
    if (run) {
      return run;
    }

    const row = this.prisma
      ? await this.dbRead(
          () =>
            this.prisma!.ingestionRun.findUnique({
              where: { run_id: runId },
              select: {
                run_id: true,
                created_at: true,
                started_at: true,
                finished_at: true,
                mode: true,
                run_kind: true,
                target_types: true,
                status: true,
                parent_run_id: true,
                processed_count: true,
                success_count: true,
                failed_count: true,
              },
            }),
          null,
        )
      : null;
    if (!row) {
      throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
    }

    const loaded = this.mapDbIngestionRun(row);
    this.ingestionRuns.set(loaded.run_id, loaded);
    return loaded;
  }

  async getIngestionItems(runId: string): Promise<IngestionItem[]> {
    await this.getIngestionRun(runId);
    const local = this.ingestionItems.get(runId);
    if (local) return local;

    const rows = this.prisma
      ? await this.dbRead(
          () =>
            this.prisma!.ingestionItem.findMany({
              where: { run_id: runId },
              select: {
                run_id: true,
                video_id: true,
                source_type: true,
                update_type: true,
                status: true,
                failure_reason_code: true,
              },
            }),
          [],
        )
      : [];

    return rows.map((row) => ({
      run_id: row.run_id,
      video_id: row.video_id,
      source_type: row.source_type as TargetType,
      update_type: row.update_type === "supplement" ? "backfill" : (row.update_type as IngestionItem["update_type"]),
      status: (row.status === "failed" ? "failed" : "succeeded") as IngestionItem["status"],
      error_code: row.failure_reason_code,
      error_message: null,
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
    await this.upsertIngestionRunToDb(retry, operator);
    await this.upsertIdempotencyKeyToDb({
      idem_key: idempotencyKey,
      operator,
      endpoint,
      payload_hash: payloadHash,
      run_id: retry.run_id,
      created_at: now,
    });
    return retry;
  }

  async latestIngestionSummary() {
    const latest = [...this.ingestionRuns.values()]
      .sort((a, b) => b.accepted_at.localeCompare(a.accepted_at))
      .find((v) => v.status === "succeeded");

    if (!latest && this.prisma) {
      const row = await this.dbRead(
        () =>
          this.prisma!.ingestionRun.findFirst({
            where: { status: "succeeded" },
            orderBy: { created_at: "desc" },
            select: {
              run_id: true,
              finished_at: true,
              target_types: true,
              success_count: true,
              failed_count: true,
            },
          }),
        null,
      );
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
    if (this.testFaults.archive_missing || this.testFaults.tag_master_inconsistent || this.testFaults.distribution_down) {
      return {
        status: "critical" as const,
        checks: {
          data_freshness: "ok",
          tag_master_consistency: this.testFaults.tag_master_inconsistent ? "critical" : "ok",
          archive_page_completeness: this.testFaults.archive_missing ? "critical" : "ok",
          distribution_availability: this.testFaults.distribution_down ? "critical" : "ok",
        },
      };
    }

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
    await this.upsertRecheckRunToDb(recheck);
    return recheck;
  }

  async getRecheckRun(recheckRunId: string): Promise<RecheckRun> {
    const run = this.recheckRuns.get(recheckRunId);
    if (run) return run;

    const row = this.prisma
      ? await this.dbRead(
          () =>
            this.prisma!.recheckRun.findUnique({
              where: { recheck_run_id: recheckRunId },
              select: {
                recheck_run_id: true,
                base_run_id: true,
                status: true,
                started_at: true,
                finished_at: true,
                changed_count: true,
                unchanged_count: true,
              },
            }),
          null,
        )
      : null;
    if (!row) {
      throw new ProblemError({ status: 404, code: "RECHECK_RUN_NOT_FOUND", message: "Recheck run not found" });
    }

    return {
      recheck_run_id: row.recheck_run_id,
      run_id: row.base_run_id ?? "",
      status: row.status as RunStatus,
      started_at: row.started_at ? row.started_at.toISOString() : nowIso(),
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
    await this.dbWrite(async () => {
      await this.prisma!.tag.upsert({
        where: { tag_id: tag.tag_id },
        create: {
          tag_id: tag.tag_id,
          tag_type_id: String(tag.tag_type_id),
          tag_name: tag.tag_name,
          tag_slug: tag.slug,
          synonyms: tag.synonyms,
          sort_order: 0,
          is_active: tag.is_active,
        },
        update: {
          tag_name: tag.tag_name,
          tag_slug: tag.slug,
          synonyms: tag.synonyms,
          is_active: tag.is_active,
        },
      });
    });
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
    await this.dbWrite(async () => {
      await this.prisma!.tag.updateMany({
        where: { tag_id: tagId },
        data: {
          tag_name: tag.tag_name,
          tag_slug: tag.slug,
          synonyms: tag.synonyms,
          is_active: tag.is_active,
        },
      });
    });
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
    await this.dbWrite(async () => {
      const now = new Date();
      await Promise.all(
        setIds.map((tagId) =>
          this.prisma!.videoTag.upsert({
            where: { video_id_tag_id: { video_id: videoId, tag_id: tagId } },
            create: {
              video_id: videoId,
              tag_id: tagId,
              applied_by: "operator",
              applied_at: now,
              removed_at: null,
            },
            update: { removed_at: null, applied_at: now, applied_by: "operator" },
          }),
        ),
      );

      if (unsetIds.length > 0) {
        await this.prisma!.videoTag.updateMany({
          where: { video_id: videoId, tag_id: { in: unsetIds } },
          data: { removed_at: now },
        });
      }
    });
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
    await this.upsertPublishRunToDb(run);
    return run;
  }

  async getPublishRun(runId: string): Promise<PublishRun> {
    const run = this.publishRuns.get(runId);
    if (run) return run;

    const row = this.prisma
      ? await this.dbRead(
          () =>
            this.prisma!.publishRun.findUnique({
              where: { publish_run_id: runId },
              select: {
                publish_run_id: true,
                publish_type: true,
                status: true,
                started_at: true,
                finished_at: true,
                triggered_by: true,
                rollback_executed: true,
                rollback_to_version: true,
                error_code: true,
                error_message: true,
                retryable: true,
              },
            }),
          null,
        )
      : null;
    if (!row) {
      throw new ProblemError({ status: 404, code: "PUBLISH_RUN_NOT_FOUND", message: "Publish run not found" });
    }

    return {
      publish_run_id: row.publish_run_id,
      publish_type: row.publish_type as PublishRun["publish_type"],
      status: row.status as PublishStatus,
      started_at: row.started_at ? row.started_at.toISOString() : nowIso(),
      finished_at: row.finished_at ? new Date(row.finished_at).toISOString() : null,
      triggered_by: row.triggered_by ?? "admin",
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
    const rows = this.prisma
      ? await this.dbRead(
          () =>
            this.prisma!.video.findMany({
              where: { title: { contains: q, mode: "insensitive" } },
              select: {
                video_id: true,
                title: true,
                published_at: true,
                duration_sec: true,
                video_tags: {
                  where: { removed_at: null },
                  select: { tag_id: true },
                },
              },
            }),
          [],
        )
      : [];
    return rows.map((v) => ({
      video_id: v.video_id,
      title: v.title,
      published_at: new Date(v.published_at).toISOString(),
      duration_sec: v.duration_sec,
      tag_ids: v.video_tags.map((tag) => tag.tag_id),
    }));
  }

  async getVideo(videoId: string) {
    const video = this.videos.get(videoId);
    if (video) {
      return video;
    }
    const row = this.prisma
      ? await this.dbRead(
          () =>
            this.prisma!.video.findUnique({
              where: { video_id: videoId },
              select: {
                video_id: true,
                title: true,
                published_at: true,
                duration_sec: true,
                video_tags: {
                  where: { removed_at: null },
                  select: { tag_id: true },
                },
              },
            }),
          null,
        )
      : null;
    if (!row) {
      throw new ProblemError({ status: 404, code: "VIDEO_NOT_FOUND", message: "Video not found" });
    }
    return {
      video_id: row.video_id,
      title: row.title,
      published_at: new Date(row.published_at).toISOString(),
      duration_sec: row.duration_sec,
      tag_ids: row.video_tags.map((tag) => tag.tag_id),
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
