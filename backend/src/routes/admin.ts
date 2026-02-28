import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { store } from "../repositories/store.js";
import { problemSchema, publishStatusSchema, runStatusSchema } from "../schemas/common.js";
import { ProblemError } from "../lib/problem.js";

const postTagRoute = createRoute({
  method: "post",
  path: "/api/v1/admin/tags",
  operationId: "createTag",
  tags: ["admin"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            tag_name: z.string().min(1),
            tag_type_id: z.number().int().positive(),
            synonyms: z.array(z.string()).default([]),
            is_active: z.boolean().default(true),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: z.object({ tag_id: z.string(), updated_at: z.string().datetime() }) } },
    },
    409: { description: "Conflict", content: { "application/problem+json": { schema: problemSchema } } },
  },
});

const patchTagRoute = createRoute({
  method: "patch",
  path: "/api/v1/admin/tags/{tagId}",
  operationId: "patchTag",
  tags: ["admin"],
  request: {
    params: z.object({ tagId: z.string().openapi({ param: { name: "tagId", in: "path" } }) }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            tag_name: z.string().optional(),
            synonyms: z.array(z.string()).optional(),
            is_active: z.boolean().optional(),
            merged_into: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: {
        "application/json": {
          schema: z.object({
            tag_id: z.string(),
            propagation_state: z.enum(["pending_publish", "published"]),
            updated_at: z.string().datetime(),
          }),
        },
      },
    },
  },
});

const patchVideoTagsRoute = createRoute({
  method: "patch",
  path: "/api/v1/admin/videos/{videoId}/tags",
  operationId: "patchVideoTags",
  tags: ["admin"],
  request: {
    params: z.object({ videoId: z.string().openapi({ param: { name: "videoId", in: "path" } }) }),
    body: {
      content: {
        "application/json": {
          schema: z.object({ set: z.array(z.string()), unset: z.array(z.string()), reason: z.string().min(1) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated",
      content: { "application/json": { schema: z.object({ video_id: z.string(), tag_ids: z.array(z.string()), updated_at: z.string() }) } },
    },
  },
});

const postPromptRoute = createRoute({
  method: "post",
  path: "/api/v1/admin/tagging/prompts",
  operationId: "createTaggingPrompt",
  tags: ["admin"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ run_id: z.string().uuid(), video_ids: z.array(z.string()).min(1), include_fields: z.array(z.string()) }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Prompt",
      content: {
        "application/json": {
          schema: z.object({
            prompt_text: z.string(),
            prompt_version: z.string(),
            video_count: z.number(),
            generated_at: z.string().datetime(),
          }),
        },
      },
    },
  },
});

const postImportRoute = createRoute({
  method: "post",
  path: "/api/v1/admin/tagging/imports",
  operationId: "importTaggingJson",
  tags: ["admin"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            schema_version: z.literal("v1"),
            items: z.array(
              z.object({
                video_id: z.string(),
                set: z.array(z.string()),
                unset: z.array(z.string()),
                reason: z.string(),
              }),
            ),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Imported",
      content: {
        "application/json": {
          schema: z.object({
            import_run_id: z.string().uuid(),
            validated_count: z.number(),
            applied_count: z.number(),
            rejected_count: z.number(),
            errors: z.array(z.object({ index: z.number(), code: z.string(), message: z.string(), field: z.string().optional() })),
            next_action: z.enum(["publish_required", "no_change"]),
            publish_scope: z.string().optional(),
          }),
        },
      },
    },
  },
});

const postDocsPublishRoute = createRoute({
  method: "post",
  path: "/api/v1/admin/docs/publish",
  operationId: "createDocsPublishRun",
  tags: ["admin"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z
            .object({
              targetRef: z.string().optional(),
              forceInvalidate: z.boolean().optional(),
              reason: z.string().optional(),
            })
            .optional(),
        },
      },
    },
  },
  responses: {
    202: {
      description: "Accepted",
      content: {
        "application/json": {
          schema: z.object({ docs_publish_run_id: z.string().uuid(), status: publishStatusSchema, started_at: z.string().datetime() }),
        },
      },
    },
  },
});

const getDocsPublishRoute = createRoute({
  method: "get",
  path: "/api/v1/admin/docs/publish/{docsPublishRunId}",
  operationId: "getDocsPublishRun",
  tags: ["admin"],
  request: {
    params: z.object({ docsPublishRunId: z.string().uuid().openapi({ param: { name: "docsPublishRunId", in: "path" } }) }),
  },
  responses: {
    200: {
      description: "Run status",
      content: {
        "application/json": {
          schema: z.object({
            docs_publish_run_id: z.string().uuid(),
            status: publishStatusSchema,
            steps: z.array(z.object({ name: z.string(), status: publishStatusSchema })),
            rollback: z.object({ executed: z.boolean(), rollback_to_version: z.string().optional() }),
          }),
        },
      },
    },
  },
});

const postTagMasterPublishRoute = createRoute({
  method: "post",
  path: "/api/v1/admin/publish/tag-master",
  operationId: "createTagMasterPublishRun",
  tags: ["admin"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({ scope: z.enum(["tag_master", "archive", "all"]).default("all") }).optional(),
        },
      },
    },
  },
  responses: {
    202: {
      description: "Accepted",
      content: { "application/json": { schema: z.object({ publish_run_id: z.string().uuid(), status: runStatusSchema }) } },
    },
  },
});

const getPublishRoute = createRoute({
  method: "get",
  path: "/api/v1/admin/publish/{publishRunId}",
  operationId: "getPublishRun",
  tags: ["admin"],
  request: {
    params: z.object({ publishRunId: z.string().uuid().openapi({ param: { name: "publishRunId", in: "path" } }) }),
  },
  responses: {
    200: {
      description: "Run status",
      content: {
        "application/json": {
          schema: z.object({
            publish_run_id: z.string().uuid(),
            publish_type: z.enum(["tag_master", "archive", "all", "docs"]),
            status: publishStatusSchema,
            started_at: z.string().datetime(),
            finished_at: z.string().datetime().nullable(),
            triggered_by: z.string(),
            steps: z.array(z.object({ name: z.string(), status: publishStatusSchema })),
            rollback: z.object({ executed: z.boolean(), rollback_to_version: z.string().optional() }),
            error_code: z.string().nullable(),
            error_message: z.string().nullable(),
            retryable: z.boolean(),
          }),
        },
      },
    },
  },
});

export const registerAdminRoutes = (app: OpenAPIHono<any>) => {
  app.openapi(postTagRoute, (async (c: any) => {
    const body = c.req.valid("json");
    const tag = await store.createTag(body);
    return c.json({ tag_id: tag.tag_id, updated_at: tag.updated_at }, 201);
  }) as any);

  app.openapi(patchTagRoute, (async (c: any) => {
    const { tagId } = c.req.valid("param");
    const body = c.req.valid("json");
    const tag = await store.updateTag(tagId, body);
    return c.json({ tag_id: tag.tag_id, propagation_state: tag.propagation_state, updated_at: tag.updated_at });
  }) as any);

  app.openapi(patchVideoTagsRoute, (async (c: any) => {
    const { videoId } = c.req.valid("param");
    const body = c.req.valid("json");
    const result = await store.patchVideoTags(videoId, body.set, body.unset);
    return c.json(result);
  }) as any);

  app.openapi(postPromptRoute, (async (c: any) => {
    const body = c.req.valid("json");
    return c.json(await store.createTaggingPrompt(body.run_id, body.video_ids, body.include_fields));
  }) as any);

  app.openapi(postImportRoute, (async (c: any) => {
    const body = c.req.valid("json");
    const result = await store.importTagging(
      body.items.map((v: any) => ({
        videoId: v.video_id,
        set: v.set,
        unset: v.unset,
        reason: v.reason,
      })),
    );
    return c.json(result);
  }) as any);

  app.openapi(postDocsPublishRoute, (async (c: any) => {
    const body = c.req.valid("json");
    if (body?.targetRef && body.targetRef !== "main") {
      throw new ProblemError({ status: 400, code: "INVALID_TARGET_REF", message: "targetRef must be main" });
    }
    const run = await store.createPublishRun("docs", "admin");
    return c.json({ docs_publish_run_id: run.publish_run_id, status: run.status, started_at: run.started_at }, 202);
  }) as any);

  app.openapi(getDocsPublishRoute, (async (c: any) => {
    const { docsPublishRunId } = c.req.valid("param");
    const run = await store.getPublishRun(docsPublishRunId);
    if (run.publish_type !== "docs") {
      throw new ProblemError({ status: 404, code: "PUBLISH_RUN_NOT_FOUND", message: "Docs publish run not found" });
    }
    return c.json({ docs_publish_run_id: run.publish_run_id, status: run.status, steps: run.steps, rollback: run.rollback });
  }) as any);

  app.openapi(postTagMasterPublishRoute, (async (c: any) => {
    const body = c.req.valid("json");
    const run = await store.createPublishRun(body?.scope ?? "all", "admin");
    return c.json({ publish_run_id: run.publish_run_id, status: run.status === "rolled_back" ? "failed" : run.status }, 202);
  }) as any);

  app.openapi(getPublishRoute, (async (c: any) => {
    const { publishRunId } = c.req.valid("param");
    return c.json(await store.getPublishRun(publishRunId));
  }) as any);
};
