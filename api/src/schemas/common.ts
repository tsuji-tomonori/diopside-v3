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

const problemResponse = (description: string) => ({
  description,
  content: { "application/problem+json": { schema: problemSchema } },
});

export const badRequestProblemResponse = problemResponse("Bad request");
export const unauthorizedProblemResponse = problemResponse("Unauthorized");
export const forbiddenProblemResponse = problemResponse("Forbidden");
export const notFoundProblemResponse = problemResponse("Not found");
export const conflictProblemResponse = problemResponse("Conflict");
export const tooManyRequestsProblemResponse = problemResponse("Too many requests");
export const internalServerErrorProblemResponse = problemResponse("Internal server error");

export const authenticatedOperationErrorResponses = {
  401: unauthorizedProblemResponse,
  500: internalServerErrorProblemResponse,
} as const;

export const adminOperationErrorResponses = {
  401: unauthorizedProblemResponse,
  403: forbiddenProblemResponse,
  500: internalServerErrorProblemResponse,
} as const;
