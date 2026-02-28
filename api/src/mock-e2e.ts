import type { OpenAPIHono } from "@hono/zod-openapi";
import { randomUUID } from "node:crypto";
import { ProblemError } from "./lib/problem.js";

type MockRunStatus = "queued" | "running" | "succeeded" | "failed" | "partial" | "cancelled";

type MockRun = {
  run_id: string;
  run_kind: "official_ingestion" | "appearance_supplement" | "incremental_update";
  trigger_mode: "manual" | "scheduled";
  target_types: Array<"official" | "appearance">;
  accepted_at: string;
  status: MockRunStatus;
  processed_count: number;
  success_count: number;
  failed_count: number;
  error_summary: string | null;
  finished_at: string | null;
};

type MockPublishRun = {
  publish_run_id: string;
  publish_type: "tag_master" | "archive" | "all" | "docs";
  status: "queued" | "running" | "succeeded" | "failed" | "partial" | "cancelled" | "rolled_back";
  started_at: string;
  finished_at: string | null;
  retryable: boolean;
  error_code: string | null;
  error_message: string | null;
};

type MockState = {
  runs: Map<string, MockRun>;
  runItems: Map<string, Array<{
    video_id: string;
    source_type: "official" | "appearance";
    update_type: "new" | "existing" | "backfill" | "recheck";
    status: "succeeded" | "failed";
    error_code: string | null;
  }>>;
  idempotency: Map<string, string>;
  lastRunId: string | null;
  rechecks: Map<string, { recheck_run_id: string; run_id: string; status: MockRunStatus; started_at: string; finished_at: string | null; diff_summary: { changed_count: number; unchanged_count: number } }>;
  publishRuns: Map<string, MockPublishRun>;
  tags: Map<string, { tag_id: string; tag_name: string; propagation_state: "pending_publish" | "published"; updated_at: string }>;
  faults: {
    ingestion_fail: boolean;
    archive_missing: boolean;
    tag_master_inconsistent: boolean;
    distribution_down: boolean;
    publish_fail: boolean;
  };
};

function newState(): MockState {
  const now = new Date().toISOString();
  return {
    runs: new Map(),
    runItems: new Map(),
    idempotency: new Map(),
    lastRunId: null,
    rechecks: new Map(),
    publishRuns: new Map(),
    tags: new Map([
      ["tag-game", { tag_id: "tag-game", tag_name: "ゲーム", propagation_state: "published", updated_at: now }],
      ["tag-chat", { tag_id: "tag-chat", tag_name: "雑談", propagation_state: "published", updated_at: now }],
    ]),
    faults: {
      ingestion_fail: false,
      archive_missing: false,
      tag_master_inconsistent: false,
      distribution_down: false,
      publish_fail: false,
    },
  };
}

function healthOf(state: MockState) {
  const checks = {
    data_freshness: "ok",
    tag_master_consistency: state.faults.tag_master_inconsistent ? "critical" : "ok",
    archive_page_completeness: state.faults.archive_missing ? "critical" : "ok",
    distribution_availability: state.faults.distribution_down ? "critical" : "ok",
  };
  const values = Object.values(checks);
  const status = values.includes("critical") ? "critical" : values.includes("degraded") ? "degraded" : "ok";
  return { status, checks };
}

export function registerMockE2ERoutes(app: OpenAPIHono<any>) {
  const state = newState();

  const reset = () => {
    const s = newState();
    state.runs = s.runs;
    state.runItems = s.runItems;
    state.idempotency = s.idempotency;
    state.lastRunId = s.lastRunId;
    state.rechecks = s.rechecks;
    state.publishRuns = s.publishRuns;
    state.tags = s.tags;
    state.faults = s.faults;
  };

  const scheduleRun = (runId: string, fail: boolean) => {
    setTimeout(() => {
      const run = state.runs.get(runId);
      if (!run || run.status !== "queued") return;
      run.status = "running";
      run.processed_count = 1;
    }, 120);

    setTimeout(() => {
      const run = state.runs.get(runId);
      if (!run || (run.status !== "queued" && run.status !== "running")) return;
      run.status = fail ? "failed" : "succeeded";
      run.finished_at = new Date().toISOString();
      run.processed_count = 3;
      run.success_count = fail ? 1 : 3;
      run.failed_count = fail ? 2 : 0;
      run.error_summary = fail ? "simulated ingestion failure" : null;
    }, 420);
  };

  const schedulePublish = (publishRunId: string, fail: boolean) => {
    setTimeout(() => {
      const run = state.publishRuns.get(publishRunId);
      if (!run) return;
      run.status = "running";
    }, 120);

    setTimeout(() => {
      const run = state.publishRuns.get(publishRunId);
      if (!run) return;
      run.status = fail ? "failed" : "succeeded";
      run.finished_at = new Date().toISOString();
      run.retryable = fail;
      run.error_code = fail ? "PUBLISH_STEP_FAILED" : null;
      run.error_message = fail ? "simulated publish failure" : null;
      if (!fail) {
        for (const tag of state.tags.values()) {
          tag.propagation_state = "published";
        }
      }
    }, 360);
  };

  app.post("/api/v1/test/e2e/reset", (c) => {
    reset();
    return c.json({ ok: true });
  });

  app.post("/api/v1/test/e2e/faults", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<MockState["faults"]>;
    state.faults = { ...state.faults, ...body };
    return c.json({ ok: true, faults: state.faults });
  });

  app.post("/api/v1/ops/ingestion/runs", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as Partial<Pick<MockRun, "trigger_mode" | "run_kind" | "target_types">>;
    const idem = c.req.header("idempotency-key");
    if (!idem) {
      throw new ProblemError({ status: 400, code: "MISSING_IDEMPOTENCY_KEY", message: "Idempotency-Key is required" });
    }
    if (!Array.isArray(body.target_types) || body.target_types.length === 0) {
      throw new ProblemError({ status: 400, code: "INVALID_TARGET", message: "target_types must not be empty" });
    }

    const cached = state.idempotency.get(idem);
    if (cached) {
      const existing = state.runs.get(cached);
      if (!existing) {
        throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
      }
      return c.json({
        run_id: existing.run_id,
        accepted_at: existing.accepted_at,
        trigger_mode: existing.trigger_mode,
        run_kind: existing.run_kind,
        target_types: existing.target_types,
      }, 202);
    }

    const runKind = body.run_kind ?? "official_ingestion";
    const conflict = Array.from(state.runs.values()).some((v) => v.run_kind === runKind && (v.status === "queued" || v.status === "running"));
    if (conflict) {
      throw new ProblemError({ status: 409, code: "RUN_ALREADY_ACTIVE", message: "Active run already exists" });
    }

    const now = new Date().toISOString();
    const runId = randomUUID();
    const run: MockRun = {
      run_id: runId,
      accepted_at: now,
      trigger_mode: body.trigger_mode ?? "manual",
      run_kind: runKind,
      target_types: body.target_types,
      status: "queued",
      processed_count: 0,
      success_count: 0,
      failed_count: 0,
      error_summary: null,
      finished_at: null,
    };

    state.runs.set(runId, run);
    state.idempotency.set(idem, runId);
    state.lastRunId = runId;
    state.runItems.set(runId, [
      { video_id: "GoWhHtJmIbk", source_type: "official", update_type: "new", status: "succeeded", error_code: null },
      { video_id: "7keH8yrqabc", source_type: "appearance", update_type: "existing", status: state.faults.ingestion_fail ? "failed" : "succeeded", error_code: state.faults.ingestion_fail ? "NORMALIZE_FAILED" : null },
    ]);

    scheduleRun(runId, state.faults.ingestion_fail);

    return c.json({
      run_id: run.run_id,
      accepted_at: run.accepted_at,
      trigger_mode: run.trigger_mode,
      run_kind: run.run_kind,
      target_types: run.target_types,
    }, 202);
  });

  app.get("/api/v1/ops/ingestion/runs/:runId", (c) => {
    const run = state.runs.get(c.req.param("runId"));
    if (!run) throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
    return c.json(run);
  });

  app.get("/api/v1/ops/ingestion/runs/:runId/items", (c) => {
    const runId = c.req.param("runId");
    if (!state.runs.has(runId)) throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
    return c.json({ run_id: runId, items: state.runItems.get(runId) ?? [] });
  });

  app.post("/api/v1/ops/ingestion/runs/:runId/retry", (c) => {
    const parent = state.runs.get(c.req.param("runId"));
    if (!parent) throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
    if (parent.status !== "failed" && parent.status !== "partial") {
      throw new ProblemError({ status: 409, code: "RETRY_NOT_ALLOWED", message: "Retry is allowed only for failed runs" });
    }
    const now = new Date().toISOString();
    const retryId = randomUUID();
    const retry: MockRun = {
      run_id: retryId,
      accepted_at: now,
      trigger_mode: "manual",
      run_kind: parent.run_kind,
      target_types: parent.target_types,
      status: "queued",
      processed_count: 0,
      success_count: 0,
      failed_count: 0,
      error_summary: null,
      finished_at: null,
    };
    state.runs.set(retryId, retry);
    state.runItems.set(retryId, state.runItems.get(parent.run_id) ?? []);
    state.lastRunId = retryId;
    scheduleRun(retryId, false);
    return c.json({ run_id: retryId, parent_run_id: parent.run_id, accepted_at: now }, 202);
  });

  app.get("/api/v1/ops/ingestion/latest", (c) => {
    return c.json({
      last_success_at: null,
      last_run_id: state.lastRunId,
      target_counts: { official: 1, appearance: 1, total: 2 },
      warnings: [],
    });
  });

  app.get("/api/v1/ops/diagnostics/health", (c) => {
    return c.json(healthOf(state));
  });

  app.post("/api/v1/ops/rechecks", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { run_id?: string };
    if (!body.run_id || !state.runs.has(body.run_id)) {
      throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "Run not found" });
    }
    const now = new Date().toISOString();
    const recheck = {
      recheck_run_id: randomUUID(),
      run_id: body.run_id,
      status: "succeeded" as const,
      started_at: now,
      finished_at: now,
      diff_summary: { changed_count: 1, unchanged_count: 2 },
    };
    state.rechecks.set(recheck.recheck_run_id, recheck);
    return c.json(recheck, 202);
  });

  app.get("/api/v1/ops/rechecks/:recheckRunId", (c) => {
    const run = state.rechecks.get(c.req.param("recheckRunId"));
    if (!run) throw new ProblemError({ status: 404, code: "RECHECK_RUN_NOT_FOUND", message: "Recheck run not found" });
    return c.json(run);
  });

  app.post("/api/v1/admin/tagging/imports", async (c) => {
    const body = (await c.req.json().catch(() => ({ items: [] }))) as { items?: Array<{ set?: string[] }> };
    for (const item of body.items ?? []) {
      for (const t of item.set ?? []) {
        state.tags.set(`tag-${t}`, {
          tag_id: `tag-${t}`,
          tag_name: t,
          propagation_state: "pending_publish",
          updated_at: new Date().toISOString(),
        });
      }
    }
    return c.json({
      import_run_id: randomUUID(),
      validated_count: (body.items ?? []).length,
      applied_count: (body.items ?? []).length,
      rejected_count: 0,
      errors: [],
      next_action: "publish_required",
      publish_scope: "all",
    });
  });

  app.patch("/api/v1/admin/tags/:tagId", async (c) => {
    const tag = state.tags.get(c.req.param("tagId"));
    if (!tag) throw new ProblemError({ status: 404, code: "TAG_NOT_FOUND", message: "Tag not found" });
    const body = (await c.req.json().catch(() => ({}))) as { tag_name?: string };
    if (body.tag_name && body.tag_name.trim()) {
      tag.tag_name = body.tag_name.trim();
    }
    tag.propagation_state = "pending_publish";
    tag.updated_at = new Date().toISOString();
    return c.json({ tag_id: tag.tag_id, propagation_state: tag.propagation_state, updated_at: tag.updated_at });
  });

  app.post("/api/v1/admin/publish/tag-master", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { scope?: "tag_master" | "archive" | "all" };
    const runId = randomUUID();
    state.publishRuns.set(runId, {
      publish_run_id: runId,
      publish_type: body.scope ?? "all",
      status: "queued",
      started_at: new Date().toISOString(),
      finished_at: null,
      retryable: false,
      error_code: null,
      error_message: null,
    });
    schedulePublish(runId, state.faults.publish_fail);
    return c.json({ publish_run_id: runId, status: "queued" }, 202);
  });

  app.post("/api/v1/admin/publish/runs", async (c) => {
    const body = (await c.req.json().catch(() => ({}))) as { scope?: "tag_master" | "archive" | "all" };
    const runId = randomUUID();
    state.publishRuns.set(runId, {
      publish_run_id: runId,
      publish_type: body.scope ?? "all",
      status: "queued",
      started_at: new Date().toISOString(),
      finished_at: null,
      retryable: false,
      error_code: null,
      error_message: null,
    });
    schedulePublish(runId, state.faults.publish_fail);
    return c.json({ publish_run_id: runId, status: "queued" }, 202);
  });

  app.get("/api/v1/admin/publish/:publishRunId", (c) => {
    const run = state.publishRuns.get(c.req.param("publishRunId"));
    if (!run) throw new ProblemError({ status: 404, code: "PUBLISH_RUN_NOT_FOUND", message: "Publish run not found" });
    return c.json({
      ...run,
      triggered_by: "admin",
      steps: [
        { name: "generate", status: run.status },
        { name: "validate", status: run.status === "queued" ? "queued" : run.status },
      ],
      rollback: { executed: false },
    });
  });

  app.post("/api/v1/admin/docs/publish", (c) => {
    const runId = randomUUID();
    state.publishRuns.set(runId, {
      publish_run_id: runId,
      publish_type: "docs",
      status: "queued",
      started_at: new Date().toISOString(),
      finished_at: null,
      retryable: false,
      error_code: null,
      error_message: null,
    });
    schedulePublish(runId, state.faults.publish_fail);
    return c.json({ docs_publish_run_id: runId, status: "queued", started_at: new Date().toISOString() }, 202);
  });

  app.get("/api/v1/admin/docs/publish/:docsPublishRunId", (c) => {
    const run = state.publishRuns.get(c.req.param("docsPublishRunId"));
    if (!run || run.publish_type !== "docs") {
      throw new ProblemError({ status: 404, code: "PUBLISH_RUN_NOT_FOUND", message: "Docs publish run not found" });
    }
    return c.json({
      docs_publish_run_id: run.publish_run_id,
      status: run.status,
      steps: [{ name: "docs", status: run.status }],
      rollback: { executed: false },
    });
  });
}
