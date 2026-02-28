import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";
import { store } from "../src/repositories/store.js";

process.env.JWT_DEV_BYPASS = "1";

const app = buildApp();

const withAuth = (init: RequestInit = {}): RequestInit => ({
  ...init,
  headers: {
    authorization: "Bearer test-token",
    "content-type": "application/json",
    ...(init.headers ?? {}),
  },
});

const getCode = async (res: Response): Promise<string | null> => {
  const body = (await res.json()) as { code?: string };
  return body.code ?? null;
};

describe("UT-PLAN-005 case-id based tests", () => {
  it("UT-CASE-BE-001", async () => {
    const ok = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "ut001-ok" },
        body: JSON.stringify({ trigger_mode: "manual", run_kind: "official_ingestion", target_types: ["official", "appearance"] }),
      }),
    );
    expect(ok.status).toBe(202);
    const okBody = (await ok.json()) as { run_id: string };

    const invalid = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "ut001-invalid" },
        body: JSON.stringify({ trigger_mode: "manual", run_kind: "official_ingestion", target_types: [] }),
      }),
    );
    expect(invalid.status).toBe(400);
    expect(await getCode(invalid)).toBe("INVALID_TARGET");

    const idem1 = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "ut001-idem" },
        body: JSON.stringify({ trigger_mode: "manual", run_kind: "incremental_update", target_types: ["official"] }),
      }),
    );
    const idem1Body = (await idem1.json()) as { run_id: string };
    const idem2 = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "ut001-idem" },
        body: JSON.stringify({ trigger_mode: "manual", run_kind: "incremental_update", target_types: ["official"] }),
      }),
    );
    const idem2Body = (await idem2.json()) as { run_id: string };
    expect(idem2Body.run_id).toBe(idem1Body.run_id);

    const conflict = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "ut001-conflict" },
        body: JSON.stringify({ trigger_mode: "manual", run_kind: "official_ingestion", target_types: ["official"] }),
      }),
    );
    expect(conflict.status).toBe(409);
    expect(await getCode(conflict)).toBe("RUN_ALREADY_ACTIVE");

    expect(okBody.run_id).toBeTruthy();
  });

  it("UT-CASE-BE-002", async () => {
    const queuedId = "11111111-1111-1111-1111-111111111111";
    const runningId = "22222222-2222-2222-2222-222222222222";
    const succeededId = "33333333-3333-3333-3333-333333333333";
    const failedId = "44444444-4444-4444-4444-444444444444";
    const now = new Date().toISOString();

    store.ingestionRuns.set(queuedId, {
      run_id: queuedId,
      accepted_at: now,
      started_at: null,
      finished_at: null,
      trigger_mode: "manual",
      run_kind: "official_ingestion",
      target_types: ["official"],
      status: "queued",
      parent_run_id: null,
      processed_count: 0,
      success_count: 0,
      failed_count: 0,
      error_summary: null,
    });
    store.ingestionRuns.set(runningId, { ...store.ingestionRuns.get(queuedId)!, run_id: runningId, status: "running", started_at: now });
    store.ingestionRuns.set(succeededId, {
      ...store.ingestionRuns.get(queuedId)!,
      run_id: succeededId,
      status: "succeeded",
      processed_count: 10,
      success_count: 10,
      started_at: now,
      finished_at: now,
    });
    store.ingestionRuns.set(failedId, {
      ...store.ingestionRuns.get(queuedId)!,
      run_id: failedId,
      status: "failed",
      processed_count: 10,
      success_count: 7,
      failed_count: 3,
      started_at: now,
      finished_at: now,
      error_summary: "UPSTREAM_TIMEOUT",
    });

    for (const id of [queuedId, runningId, succeededId, failedId]) {
      const res = await app.request(`/api/v1/ops/ingestion/runs/${id}`, withAuth());
      expect(res.status).toBe(200);
      const body = (await res.json()) as { status: string };
      expect(body.status).toBeTruthy();
    }

    const nf = await app.request(`/api/v1/ops/ingestion/runs/55555555-5555-5555-5555-555555555555`, withAuth());
    expect(nf.status).toBe(404);
    expect(await getCode(nf)).toBe("RUN_NOT_FOUND");

    const failedRes = await app.request(`/api/v1/ops/ingestion/runs/${failedId}`, withAuth());
    const failedBody = (await failedRes.json()) as { error_summary?: string; trace_id?: string };
    expect(failedBody.error_summary).toBeTruthy();
    expect(failedBody.trace_id).toBeTruthy();
  });

  it("UT-CASE-BE-003", async () => {
    const bootstrap = await app.request("/bootstrap.json");
    expect(bootstrap.status).toBe(200);
    const b = (await bootstrap.json()) as Record<string, unknown>;
    for (const key of ["schema_version", "bootstrap_version", "generated_at", "next", "latest"]) {
      expect(b[key]).toBeDefined();
    }

    const p0 = await app.request("/archive_index.p0.json");
    expect(p0.status).toBe(200);
    const p0Body = (await p0.json()) as { page?: number; page_size?: number; total?: number; items?: unknown[] };
    expect(typeof p0Body.page).toBe("number");
    expect(typeof p0Body.page_size).toBe("number");
    expect(typeof p0Body.total).toBe("number");
    expect(Array.isArray(p0Body.items)).toBe(true);
    expect((p0Body.items ?? []).length).toBeLessThanOrEqual(p0Body.page_size ?? 0);
  });

  it("UT-CASE-BE-004", async () => {
    const res = await app.request("/tag_master.json");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { tag_types?: unknown[]; tags?: unknown[] };
    expect(Array.isArray(body.tag_types)).toBe(true);
    expect(Array.isArray(body.tags)).toBe(true);
  });

  it("UT-CASE-BE-005", async () => {
    const kw = await app.request("/api/v1/search?q=初回", withAuth());
    expect(kw.status).toBe(200);
    const kwBody = (await kw.json()) as { items: Array<{ video_id: string }> };
    expect(kwBody.items.length).toBeGreaterThanOrEqual(1);
  });

  it("UT-CASE-BE-006", async () => {
    const ok = await app.request("/api/v1/videos/video-001", withAuth());
    expect(ok.status).toBe(200);
    const okBody = (await ok.json()) as { video_id: string; watch_url?: string; embed_url?: string };
    expect(okBody.video_id).toBe("video-001");
    expect(okBody.watch_url).toContain("video-001");
    expect(okBody.embed_url).toContain("video-001");

    const nf = await app.request("/api/v1/videos/not-exists", withAuth());
    expect(nf.status).toBe(404);
  });

  it("UT-CASE-BE-007", async () => {
    const failedId = "66666666-6666-6666-6666-666666666666";
    const succeededId = "77777777-7777-7777-7777-777777777777";
    const now = new Date().toISOString();
    store.ingestionRuns.set(failedId, {
      run_id: failedId,
      accepted_at: now,
      started_at: now,
      finished_at: now,
      trigger_mode: "manual",
      run_kind: "official_ingestion",
      target_types: ["official"],
      status: "failed",
      parent_run_id: null,
      processed_count: 1,
      success_count: 0,
      failed_count: 1,
      error_summary: "X",
    });
    store.ingestionRuns.set(succeededId, { ...store.ingestionRuns.get(failedId)!, run_id: succeededId, status: "succeeded", failed_count: 0, success_count: 1 });

    const ok = await app.request(
      `/api/v1/ops/ingestion/runs/${failedId}/retry`,
      withAuth({ method: "POST", headers: { "idempotency-key": "ut007-ok" } }),
    );
    expect(ok.status).toBe(202);

    const ng = await app.request(
      `/api/v1/ops/ingestion/runs/${succeededId}/retry`,
      withAuth({ method: "POST", headers: { "idempotency-key": "ut007-ng" } }),
    );
    expect(ng.status).toBe(409);
  });

  it("UT-CASE-BE-008", async () => {
    const latest = await app.request("/api/v1/ops/ingestion/latest", withAuth());
    expect(latest.status).toBe(200);
    const l = (await latest.json()) as { target_counts: { official: number; appearance: number; total: number } };
    expect(l.target_counts.official + l.target_counts.appearance).toBe(l.target_counts.total);

    const health = await app.request("/api/v1/ops/diagnostics/health", withAuth());
    expect(health.status).toBe(200);
    const h = (await health.json()) as { status: string; checks: Record<string, string> };
    expect(["ok", "degraded", "critical"]).toContain(h.status);
    expect(h.checks).toBeTruthy();
  });

  it("UT-CASE-BE-009", async () => {
    const runId = "88888888-8888-8888-8888-888888888888";
    const now = new Date().toISOString();
    store.ingestionRuns.set(runId, {
      run_id: runId,
      accepted_at: now,
      started_at: now,
      finished_at: now,
      trigger_mode: "manual",
      run_kind: "official_ingestion",
      target_types: ["official"],
      status: "succeeded",
      parent_run_id: null,
      processed_count: 2,
      success_count: 1,
      failed_count: 1,
      error_summary: null,
    });
    store.ingestionItems.set(runId, [
      { run_id: runId, video_id: "v1", source_type: "official", update_type: "new", status: "failed", error_code: "X", error_message: "x" },
      { run_id: runId, video_id: "v2", source_type: "official", update_type: "existing", status: "succeeded", error_code: null, error_message: null },
    ]);

    const all = await app.request(`/api/v1/ops/ingestion/runs/${runId}/items`, withAuth());
    expect(all.status).toBe(200);
    const failed = await app.request(`/api/v1/ops/ingestion/runs/${runId}/items?status=failed`, withAuth());
    expect(failed.status).toBe(200);
    const limit0 = await app.request(`/api/v1/ops/ingestion/runs/${runId}/items?limit=0`, withAuth());
    expect(limit0.status).toBe(400);
  });

  it("UT-CASE-BE-010", async () => {
    const run = await app.request(
      "/api/v1/ops/rechecks",
      withAuth({ method: "POST", body: JSON.stringify({ mode: "before_delivery", targetVideoIds: ["video-001"] }) }),
    );
    expect(run.status).toBe(202);
    const body = (await run.json()) as { recheck_run_id: string };

    const get = await app.request(`/api/v1/ops/rechecks/${body.recheck_run_id}`, withAuth());
    expect(get.status).toBe(200);

    const bad = await app.request(
      "/api/v1/ops/rechecks",
      withAuth({ method: "POST", body: JSON.stringify({ mode: "bad", targetVideoIds: [] }) }),
    );
    expect(bad.status).toBe(400);
  });

  it("UT-CASE-BE-011", async () => {
    const tag = await app.request(
      "/api/v1/admin/tags",
      withAuth({ method: "POST", body: JSON.stringify({ tag_name: "UT011", tag_type_id: 1, synonyms: [], is_active: true }) }),
    );
    expect(tag.status).toBe(201);
    const tagBody = (await tag.json()) as { tag_id: string };

    const dup = await app.request(
      "/api/v1/admin/tags",
      withAuth({ method: "POST", body: JSON.stringify({ tag_name: "UT011", tag_type_id: 1, synonyms: [], is_active: true }) }),
    );
    expect(dup.status).toBe(409);

    const patch = await app.request(
      `/api/v1/admin/tags/${tagBody.tag_id}`,
      withAuth({ method: "PATCH", body: JSON.stringify({ is_active: false }) }),
    );
    expect(patch.status).toBe(200);

    const unknownTagPatch = await app.request(
      "/api/v1/admin/videos/video-001/tags",
      withAuth({ method: "PATCH", body: JSON.stringify({ set: ["no-such-tag"], unset: [], reason: "x" }) }),
    );
    expect(unknownTagPatch.status).toBe(404);

    const prompt = await app.request(
      "/api/v1/admin/tagging/prompts",
      withAuth({ method: "POST", body: JSON.stringify({ run_id: "99999999-9999-9999-9999-999999999999", video_ids: ["video-001"], include_fields: ["title"] }) }),
    );
    expect(prompt.status).toBe(404);

    const importRes = await app.request(
      "/api/v1/admin/tagging/imports",
      withAuth({
        method: "POST",
        body: JSON.stringify({
          schema_version: "v1",
          items: [{ video_id: "video-001", set: ["tag-chat"], unset: [], reason: "ok" }],
        }),
      }),
    );
    expect(importRes.status).toBe(200);
  });

  it("UT-CASE-BE-012", async () => {
    const post = await app.request(
      "/api/v1/admin/docs/publish",
      withAuth({ method: "POST", body: JSON.stringify({ targetRef: "main", forceInvalidate: true, reason: "ut" }) }),
    );
    expect(post.status).toBe(202);
    const posted = (await post.json()) as { docs_publish_run_id: string };

    const get = await app.request(`/api/v1/admin/docs/publish/${posted.docs_publish_run_id}`, withAuth());
    expect(get.status).toBe(200);

    const badRef = await app.request(
      "/api/v1/admin/docs/publish",
      withAuth({ method: "POST", body: JSON.stringify({ targetRef: "missing-ref" }) }),
    );
    expect(badRef.status).toBe(400);
  });

  it("UT-CASE-BE-013", async () => {
    const types: Array<"tag_master" | "archive" | "all" | "docs"> = ["tag_master", "archive", "all", "docs"];
    for (const type of types) {
      const created = await store.createPublishRun(type, "ut");
      created.status = "succeeded";
      store.publishRuns.set(created.publish_run_id, created);
      const res = await app.request(`/api/v1/admin/publish/${created.publish_run_id}`, withAuth());
      expect(res.status).toBe(200);
    }

    const running = await store.createPublishRun("all", "ut");
    running.status = "running";
    store.publishRuns.set(running.publish_run_id, running);
    const runningRes = await app.request(`/api/v1/admin/publish/${running.publish_run_id}`, withAuth());
    expect(runningRes.status).toBe(200);

    const failed = await store.createPublishRun("all", "ut");
    failed.status = "failed";
    failed.error_code = "X";
    failed.error_message = "failed";
    failed.rollback.executed = true;
    store.publishRuns.set(failed.publish_run_id, failed);
    const failedRes = await app.request(`/api/v1/admin/publish/${failed.publish_run_id}`, withAuth());
    expect(failedRes.status).toBe(200);

    const rb = await store.createPublishRun("all", "ut");
    rb.status = "rolled_back";
    rb.rollback.executed = true;
    rb.rollback.rollback_to_version = "v1";
    store.publishRuns.set(rb.publish_run_id, rb);
    const rbRes = await app.request(`/api/v1/admin/publish/${rb.publish_run_id}`, withAuth());
    expect(rbRes.status).toBe(200);

    const notFound = await app.request(`/api/v1/admin/publish/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`, withAuth());
    expect(notFound.status).toBe(404);

    const badId = await app.request(`/api/v1/admin/publish/not-a-uuid`, withAuth());
    expect(badId.status).toBe(400);
  });
});
