import { createRoute, z, OpenAPIHono } from "@hono/zod-openapi";
import { ProblemError } from "../lib/problem.js";
import { store } from "../repositories/store.js";
import {
  authenticatedOperationErrorResponses,
  badRequestProblemResponse,
  conflictProblemResponse,
  notFoundProblemResponse,
  runKindSchema,
  runStatusSchema,
  targetTypeSchema,
  triggerModeSchema,
} from "../schemas/common.js";

const postIngestionRunsRoute = createRoute({
  method: "post",
  path: "/api/v1/ops/ingestion/runs",
  operationId: "createIngestionRun",
  tags: ["ops"],
  request: {
    headers: z
      .object({
        authorization: z.string().openapi({ example: "Bearer token" }),
        "idempotency-key": z.string().openapi({ example: "key-123" }),
      })
      .openapi("CreateIngestionRunHeaders"),
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              trigger_mode: triggerModeSchema,
              run_kind: runKindSchema,
              target_types: z.array(targetTypeSchema),
              from_published_at: z.string().datetime().optional(),
              dry_run: z.boolean().optional(),
            })
            .openapi("CreateIngestionRunRequest"),
        },
      },
    },
  },
  responses: {
    202: {
      description: "Accepted",
      content: {
        "application/json": {
          schema: z.object({
            run_id: z.string().uuid(),
            accepted_at: z.string().datetime(),
            trigger_mode: triggerModeSchema,
            run_kind: runKindSchema,
            target_types: z.array(targetTypeSchema),
          }),
        },
      },
    },
    400: badRequestProblemResponse,
    409: conflictProblemResponse,
    ...authenticatedOperationErrorResponses,
  },
});

const getIngestionRunRoute = createRoute({
  method: "get",
  path: "/api/v1/ops/ingestion/runs/{runId}",
  operationId: "getIngestionRun",
  tags: ["ops"],
  request: {
    params: z.object({ runId: z.string().uuid().openapi({ param: { name: "runId", in: "path" } }) }),
  },
  responses: {
    200: {
      description: "Run detail",
      content: {
        "application/json": {
          schema: z.object({
            run_id: z.string().uuid(),
            accepted_at: z.string().datetime(),
            trigger_mode: triggerModeSchema,
            run_kind: runKindSchema,
            target_types: z.array(targetTypeSchema),
            status: runStatusSchema,
            processed_count: z.number(),
            error_summary: z.string().nullable(),
          }),
        },
      },
    },
    404: notFoundProblemResponse,
    ...authenticatedOperationErrorResponses,
  },
});

const getIngestionItemsRoute = createRoute({
  method: "get",
  path: "/api/v1/ops/ingestion/runs/{runId}/items",
  operationId: "getIngestionItems",
  tags: ["ops"],
  request: {
    params: z.object({ runId: z.string().uuid().openapi({ param: { name: "runId", in: "path" } }) }),
    query: z.object({
      status: z.enum(["succeeded", "failed", "unprocessed"]).optional(),
      limit: z.coerce.number().int().optional(),
      cursor: z.string().optional(),
    }),
  },
  responses: {
    200: {
      description: "Run items",
      content: {
        "application/json": {
          schema: z.object({
            run_id: z.string().uuid(),
            items: z.array(
              z.object({
                video_id: z.string(),
                source_type: targetTypeSchema,
                update_type: z.enum(["new", "existing", "backfill", "recheck"]),
                status: z.enum(["succeeded", "failed"]),
                error_code: z.string().nullable(),
              }),
            ),
          }),
        },
      },
    },
    400: badRequestProblemResponse,
    404: notFoundProblemResponse,
    ...authenticatedOperationErrorResponses,
  },
});

const retryRoute = createRoute({
  method: "post",
  path: "/api/v1/ops/ingestion/runs/{runId}/retry",
  operationId: "retryIngestionRun",
  tags: ["ops"],
  request: {
    params: z.object({ runId: z.string().uuid().openapi({ param: { name: "runId", in: "path" } }) }),
    headers: z.object({ "idempotency-key": z.string() }),
  },
  responses: {
    202: {
      description: "Retry accepted",
      content: {
        "application/json": {
          schema: z.object({
            run_id: z.string().uuid(),
            parent_run_id: z.string().uuid(),
            accepted_at: z.string().datetime(),
          }),
        },
      },
    },
    400: badRequestProblemResponse,
    404: notFoundProblemResponse,
    409: conflictProblemResponse,
    ...authenticatedOperationErrorResponses,
  },
});

const latestRoute = createRoute({
  method: "get",
  path: "/api/v1/ops/ingestion/latest",
  operationId: "getIngestionLatest",
  tags: ["ops"],
  responses: {
    200: {
      description: "Latest summary",
      content: {
        "application/json": {
          schema: z.object({
            last_success_at: z.string().datetime().nullable(),
            last_run_id: z.string().uuid().nullable(),
            target_counts: z.object({
              official: z.number(),
              appearance: z.number(),
              total: z.number(),
            }),
            warnings: z.array(z.string()),
          }),
        },
      },
    },
    ...authenticatedOperationErrorResponses,
  },
});

const healthRoute = createRoute({
  method: "get",
  path: "/api/v1/ops/diagnostics/health",
  operationId: "getHealth",
  tags: ["ops"],
  responses: {
    200: {
      description: "Diagnostics",
      content: {
        "application/json": {
          schema: z.object({
            status: z.enum(["ok", "degraded", "critical"]),
            checks: z.object({
              data_freshness: z.string(),
              tag_master_consistency: z.string(),
              archive_page_completeness: z.string(),
              distribution_availability: z.string(),
            }),
          }),
        },
      },
    },
    ...authenticatedOperationErrorResponses,
  },
});

const postRechecksRoute = createRoute({
  method: "post",
  path: "/api/v1/ops/rechecks",
  operationId: "createRecheckRun",
  tags: ["ops"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.union([
            z.object({ run_id: z.string().uuid() }),
            z.object({
              mode: z.enum(["before_delivery", "after_delivery"]),
              targetVideoIds: z.array(z.string()),
            }),
          ]),
        },
      },
    },
  },
  responses: {
    202: {
      description: "Recheck accepted",
      content: {
        "application/json": {
          schema: z.object({
            recheck_run_id: z.string().uuid(),
            run_id: z.string().uuid(),
            status: runStatusSchema,
            started_at: z.string().datetime(),
          }),
        },
      },
    },
    400: badRequestProblemResponse,
    404: notFoundProblemResponse,
    ...authenticatedOperationErrorResponses,
  },
});

const getRecheckRoute = createRoute({
  method: "get",
  path: "/api/v1/ops/rechecks/{recheckRunId}",
  operationId: "getRecheckRun",
  tags: ["ops"],
  request: {
    params: z.object({ recheckRunId: z.string().uuid().openapi({ param: { name: "recheckRunId", in: "path" } }) }),
  },
  responses: {
    200: {
      description: "Recheck detail",
      content: {
        "application/json": {
          schema: z.object({
            recheck_run_id: z.string().uuid(),
            run_id: z.string().uuid(),
            status: runStatusSchema,
            started_at: z.string().datetime(),
            finished_at: z.string().datetime().nullable(),
            diff_summary: z.object({ changed_count: z.number(), unchanged_count: z.number() }),
          }),
        },
      },
    },
    404: notFoundProblemResponse,
    ...authenticatedOperationErrorResponses,
  },
});

export const registerOpsRoutes = (app: OpenAPIHono<any>) => {
  app.openapi(postIngestionRunsRoute, (async (c: any) => {
    const body = c.req.valid("json");
    const idempotencyKey = c.req.header("idempotency-key");
    if (!idempotencyKey) {
      throw new ProblemError({ status: 400, code: "MISSING_IDEMPOTENCY_KEY", message: "Idempotency-Key is required" });
    }
    if (!Array.isArray(body.target_types) || body.target_types.length === 0) {
      throw new ProblemError({ status: 400, code: "INVALID_TARGET", message: "target_types must not be empty" });
    }

    const run = await store.createIngestionRun({
      trigger_mode: body.trigger_mode,
      run_kind: body.run_kind,
      target_types: body.target_types,
      operator: "admin",
      endpoint: "/api/v1/ops/ingestion/runs",
      idempotency_key: idempotencyKey,
    });

    return c.json(
      {
        run_id: run.run_id,
        accepted_at: run.accepted_at,
        trigger_mode: run.trigger_mode,
        run_kind: run.run_kind,
        target_types: run.target_types,
      },
      202,
    );
  }) as any);

  app.openapi(getIngestionRunRoute, (async (c: any) => {
    const { runId } = c.req.valid("param");
    const run = await store.getIngestionRun(runId);
    return c.json({ ...run, trace_id: c.get("trace_id") });
  }) as any);

  app.openapi(getIngestionItemsRoute, (async (c: any) => {
    const { runId } = c.req.valid("param");
    const query = c.req.valid("query");
    if (query.limit !== undefined && (query.limit <= 0 || query.limit > 200)) {
      throw new ProblemError({ status: 400, code: "INVALID_LIMIT", message: "limit must be between 1 and 200" });
    }
    if (query.cursor !== undefined && !/^\d+$/.test(query.cursor)) {
      throw new ProblemError({ status: 400, code: "INVALID_CURSOR", message: "cursor format is invalid" });
    }

    let items = await store.getIngestionItems(runId);
    if (query.status === "succeeded" || query.status === "failed") {
      items = items.filter((v) => v.status === query.status);
    }
    const offset = query.cursor ? Number(query.cursor) : 0;
    const limit = query.limit ?? items.length;
    const page = items.slice(offset, offset + limit);
    const nextCursor = offset + limit < items.length ? String(offset + limit) : undefined;
    return c.json({ run_id: runId, items: page, next_cursor: nextCursor });
  }) as any);

  app.openapi(retryRoute, (async (c: any) => {
    const { runId } = c.req.valid("param");
    const key = c.req.header("idempotency-key");
    if (!key) {
      throw new ProblemError({ status: 400, code: "MISSING_IDEMPOTENCY_KEY", message: "Idempotency-Key is required" });
    }
    const run = await store.retryRun(runId, "admin", "/api/v1/ops/ingestion/runs/{runId}/retry", key);
    return c.json({ run_id: run.run_id, parent_run_id: runId, accepted_at: run.accepted_at }, 202);
  }) as any);

  app.openapi(latestRoute, (async (c: any) => c.json(await store.latestIngestionSummary())) as any);
  app.openapi(healthRoute, (async (c: any) => c.json(await store.diagnosticsHealth())) as any);

  app.openapi(postRechecksRoute, (async (c: any) => {
    const body = c.req.valid("json");
    if (body.mode !== undefined) {
      if (body.mode !== "before_delivery" && body.mode !== "after_delivery") {
        throw new ProblemError({ status: 400, code: "INVALID_RECHECK_MODE", message: "mode is invalid" });
      }
      if (!Array.isArray(body.targetVideoIds) || body.targetVideoIds.length === 0) {
        throw new ProblemError({ status: 400, code: "INVALID_TARGET_VIDEOS", message: "targetVideoIds must not be empty" });
      }
      const latest = await store.latestIngestionSummary();
      if (!latest.last_run_id) {
        throw new ProblemError({ status: 404, code: "RUN_NOT_FOUND", message: "No ingestion run found" });
      }
      const run = await store.createRecheckRun(latest.last_run_id);
      return c.json(run, 202);
    }

    const run = await store.createRecheckRun(body.run_id);
    return c.json(run, 202);
  }) as any);

  app.openapi(getRecheckRoute, (async (c: any) => {
    const { recheckRunId } = c.req.valid("param");
    return c.json(await store.getRecheckRun(recheckRunId));
  }) as any);
};
