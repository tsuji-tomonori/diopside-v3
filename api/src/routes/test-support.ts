import type { OpenAPIHono } from "@hono/zod-openapi";
import { ProblemError } from "../lib/problem.js";
import type { PublishStatus } from "../domain/types.js";
import { isRunStatus, store } from "../repositories/store.js";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitState = new Map<string, { count: number; resetAt: number }>();

const isPublishStatus = (value: string): value is PublishStatus =>
  ["queued", "running", "succeeded", "failed", "partial", "cancelled", "rolled_back"].includes(value);

function assertEnabled() {
  if (process.env.E2E_TEST_MODE !== "1") {
    throw new ProblemError({ status: 404, code: "NOT_FOUND", message: "Not found" });
  }
}

function assertSecret(headerValue: string | undefined) {
  const expected = process.env.E2E_TEST_SECRET;
  if (!expected) {
    throw new ProblemError({ status: 500, code: "AUTH_CONFIG_ERROR", message: "E2E_TEST_SECRET is required" });
  }
  if (headerValue !== expected) {
    throw new ProblemError({ status: 403, code: "FORBIDDEN", message: "Invalid E2E test secret" });
  }
}

function assertRateLimit(c: any) {
  const now = Date.now();
  const forwardedFor = c.req.header("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const sub = c.get("auth_sub") ?? "anonymous";
  const key = `${ip}:${sub}`;
  const current = rateLimitState.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitState.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    throw new ProblemError({ status: 429, code: "TOO_MANY_REQUESTS", message: "Too many requests" });
  }

  current.count += 1;
  rateLimitState.set(key, current);
}

export const registerTestSupportRoutes = (app: OpenAPIHono<any>) => {
  app.post("/api/v1/test/support/reset", async (c) => {
    assertEnabled();
    assertSecret(c.req.header("x-e2e-secret"));
    assertRateLimit(c);
    store.resetForTest();
    const metrics = await store.dbMetricsForTest();
    return c.json({ ok: true, db: metrics });
  });

  app.post("/api/v1/test/support/faults", async (c) => {
    assertEnabled();
    assertSecret(c.req.header("x-e2e-secret"));
    assertRateLimit(c);
    const body = (await c.req.json().catch(() => ({}))) as Partial<{
      ingestion_fail: boolean;
      archive_missing: boolean;
      tag_master_inconsistent: boolean;
      distribution_down: boolean;
      publish_fail: boolean;
    }>;
    const faults = store.setTestFaults(body);
    return c.json({ ok: true, faults });
  });

  app.post("/api/v1/test/support/runs/:runId/status", async (c) => {
    assertEnabled();
    assertSecret(c.req.header("x-e2e-secret"));
    const runId = c.req.param("runId");
    const body = (await c.req.json().catch(() => ({}))) as {
      status?: string;
      processed_count?: number;
      success_count?: number;
      failed_count?: number;
      error_summary?: string | null;
      finished?: boolean;
      item_status?: "succeeded" | "failed";
    };
    if (!body.status || !isRunStatus(body.status)) {
      throw new ProblemError({ status: 400, code: "INVALID_STATUS", message: "status is invalid" });
    }
    const run = await store.setRunStatusForTest(runId, { ...body, status: body.status });
    return c.json(run);
  });

  app.post("/api/v1/test/support/publish/:publishRunId/status", async (c) => {
    assertEnabled();
    assertSecret(c.req.header("x-e2e-secret"));
    const publishRunId = c.req.param("publishRunId");
    const body = (await c.req.json().catch(() => ({}))) as {
      status?: "queued" | "running" | "succeeded" | "failed" | "partial" | "cancelled" | "rolled_back";
      finished?: boolean;
      error_code?: string | null;
      error_message?: string | null;
      retryable?: boolean;
    };
    if (!body.status || !isPublishStatus(body.status)) {
      throw new ProblemError({ status: 400, code: "INVALID_STATUS", message: "status is required" });
    }
    const run = await store.setPublishStatusForTest(publishRunId, { ...body, status: body.status });
    return c.json(run);
  });

  app.get("/api/v1/test/support/db/metrics", async (c) => {
    assertEnabled();
    assertSecret(c.req.header("x-e2e-secret"));
    assertRateLimit(c);
    const metrics = await store.dbMetricsForTest();
    return c.json(metrics);
  });
};
