import { z } from "@hono/zod-openapi";

export const runStatusSchema = z
  .enum(["queued", "running", "succeeded", "failed", "partial", "cancelled"])
  .openapi("RunStatus");

export const publishStatusSchema = z
  .enum(["queued", "running", "succeeded", "failed", "partial", "cancelled", "rolled_back"])
  .openapi("PublishStatus");

export const triggerModeSchema = z.enum(["manual", "scheduled"]).openapi("TriggerMode");
export const runKindSchema = z
  .enum(["official_ingestion", "appearance_supplement", "incremental_update"])
  .openapi("RunKind");
export const targetTypeSchema = z.enum(["official", "appearance"]).openapi("TargetType");

export const problemSchema = z
  .object({
    type: z.string(),
    title: z.string(),
    status: z.number(),
    detail: z.string(),
    instance: z.string(),
    code: z.string(),
    retryable: z.boolean().optional(),
    trace_id: z.string(),
    errors: z
      .array(
        z.object({
          field: z.string().optional(),
          message: z.string(),
          code: z.string().optional(),
        }),
      )
      .optional(),
  })
  .openapi("ProblemDetails");
