import { describe, expect, it } from "vitest";
import { buildApp } from "../src/app.js";

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

describe("backend api", () => {
  it("serves openapi json", async () => {
    const res = await app.request("/openapi/v1/openapi.json", withAuth());
    expect(res.status).toBe(200);
  });

  it("creates and gets ingestion run", async () => {
    const createRes = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "idem-001" },
        body: JSON.stringify({
          trigger_mode: "manual",
          run_kind: "official_ingestion",
          target_types: ["official"],
        }),
      }),
    );
    expect(createRes.status).toBe(202);
    const created = (await createRes.json()) as { run_id: string };

    const getRes = await app.request(`/api/v1/ops/ingestion/runs/${created.run_id}`, withAuth());
    expect(getRes.status).toBe(200);

    const itemsRes = await app.request(`/api/v1/ops/ingestion/runs/${created.run_id}/items`, withAuth());
    expect(itemsRes.status).toBe(200);
  });

  it("retries ingestion run", async () => {
    const createRes = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "idem-002" },
        body: JSON.stringify({
          trigger_mode: "manual",
          run_kind: "appearance_supplement",
          target_types: ["appearance"],
        }),
      }),
    );
    const created = (await createRes.json()) as { run_id: string };

    await app.request(`/api/v1/ops/ingestion/runs/${created.run_id}`, withAuth());
    const { store } = await import("../src/repositories/store.js");
    const run = store.ingestionRuns.get(created.run_id);
    if (run) {
      run.status = "failed";
      run.error_summary = "forced";
      store.ingestionRuns.set(created.run_id, run);
    }

    const retryRes = await app.request(`/api/v1/ops/ingestion/runs/${created.run_id}/retry`, withAuth({ method: "POST", headers: { "idempotency-key": "idem-retry-1" } }));
    expect(retryRes.status).toBe(202);
  });

  it("returns latest and health", async () => {
    const latest = await app.request("/api/v1/ops/ingestion/latest", withAuth());
    expect(latest.status).toBe(200);

    const health = await app.request("/api/v1/ops/diagnostics/health", withAuth());
    expect(health.status).toBe(200);
  });

  it("creates and gets recheck run", async () => {
    const createRes = await app.request(
      "/api/v1/ops/ingestion/runs",
      withAuth({
        method: "POST",
        headers: { "idempotency-key": "idem-003" },
        body: JSON.stringify({
          trigger_mode: "manual",
          run_kind: "incremental_update",
          target_types: ["official"],
        }),
      }),
    );
    const created = (await createRes.json()) as { run_id: string };

    const recheckRes = await app.request(
      "/api/v1/ops/rechecks",
      withAuth({ method: "POST", body: JSON.stringify({ run_id: created.run_id }) }),
    );
    expect(recheckRes.status).toBe(202);
    const recheck = (await recheckRes.json()) as { recheck_run_id: string };

    const getRes = await app.request(`/api/v1/ops/rechecks/${recheck.recheck_run_id}`, withAuth());
    expect(getRes.status).toBe(200);
  });

  it("handles tag and video tagging flow", async () => {
    const tagRes = await app.request(
      "/api/v1/admin/tags",
      withAuth({
        method: "POST",
        body: JSON.stringify({
          tag_name: "新規タグ",
          tag_type_id: 1,
          synonyms: [],
          is_active: true,
        }),
      }),
    );
    expect(tagRes.status).toBe(201);
    const tag = (await tagRes.json()) as { tag_id: string };

    const patchTagRes = await app.request(
      `/api/v1/admin/tags/${tag.tag_id}`,
      withAuth({ method: "PATCH", body: JSON.stringify({ is_active: false }) }),
    );
    expect(patchTagRes.status).toBe(200);

    const patchVideoTagRes = await app.request(
      "/api/v1/admin/videos/video-001/tags",
      withAuth({ method: "PATCH", body: JSON.stringify({ set: [tag.tag_id], unset: [], reason: "manual" }) }),
    );
    expect(patchVideoTagRes.status).toBe(200);
  });

  it("creates prompt and imports tagging json", async () => {
    const latestRes = await app.request("/api/v1/ops/ingestion/latest", withAuth());
    const latest = (await latestRes.json()) as { last_run_id: string | null };
    expect(latest.last_run_id).toBeTruthy();

    const promptRes = await app.request(
      "/api/v1/admin/tagging/prompts",
      withAuth({
        method: "POST",
        body: JSON.stringify({
          run_id: latest.last_run_id,
          video_ids: ["video-001"],
          include_fields: ["title", "existingTags"],
        }),
      }),
    );
    expect(promptRes.status).toBe(200);

    const importRes = await app.request(
      "/api/v1/admin/tagging/imports",
      withAuth({
        method: "POST",
        body: JSON.stringify({
          schema_version: "v1",
          items: [
            {
              video_id: "video-001",
              set: ["tag-chat"],
              unset: [],
              reason: "import",
            },
          ],
        }),
      }),
    );
    expect(importRes.status).toBe(200);
  });

  it("creates and gets docs publish and publish run", async () => {
    const docsRunRes = await app.request("/api/v1/admin/docs/publish", withAuth({ method: "POST", body: JSON.stringify({}) }));
    expect(docsRunRes.status).toBe(202);
    const docsRun = (await docsRunRes.json()) as { docs_publish_run_id: string };

    const docsGetRes = await app.request(`/api/v1/admin/docs/publish/${docsRun.docs_publish_run_id}`, withAuth());
    expect(docsGetRes.status).toBe(200);

    const pubRes = await app.request(
      "/api/v1/admin/publish/tag-master",
      withAuth({ method: "POST", body: JSON.stringify({ scope: "all" }) }),
    );
    expect(pubRes.status).toBe(202);
    const pub = (await pubRes.json()) as { publish_run_id: string };

    const getPubRes = await app.request(`/api/v1/admin/publish/${pub.publish_run_id}`, withAuth());
    expect(getPubRes.status).toBe(200);
  });

  it("provides public contract and query endpoints", async () => {
    const bootstrap = await app.request("/api/v1/public/bootstrap", withAuth());
    expect(bootstrap.status).toBe(200);

    const tagMaster = await app.request("/api/v1/public/tag-master", withAuth());
    expect(tagMaster.status).toBe(200);

    const archive = await app.request("/api/v1/public/archive-index?page=0", withAuth());
    expect(archive.status).toBe(200);

    const search = await app.request("/api/v1/search?q=初回", withAuth());
    expect(search.status).toBe(200);

    const detail = await app.request("/api/v1/videos/video-001", withAuth());
    expect(detail.status).toBe(200);
  });
});
