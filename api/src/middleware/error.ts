import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { ProblemError } from "../lib/problem.js";

export const onError: ErrorHandler = (err, c) => {
  const traceId = c.get("trace_id") ?? "unknown";
  const instance = c.req.path;

  if (err instanceof ProblemError) {
    return c.json(
      {
        type: `https://diopside.dev/problems/${err.code.toLowerCase()}`,
        title: err.code,
        status: err.status,
        detail: err.message,
        instance,
        code: err.code,
        retryable: err.retryable,
        trace_id: traceId,
        errors: err.errors,
      },
      err.status as any,
      { "content-type": "application/problem+json" },
    );
  }

  if (err instanceof HTTPException) {
    const status = err.status;
    return c.json(
      {
        type: "https://diopside.dev/problems/invalid-request",
        title: "INVALID_REQUEST",
        status,
        detail: err.message || "Request validation failed",
        instance,
        code: status === 400 ? "INVALID_REQUEST" : "HTTP_ERROR",
        retryable: false,
        trace_id: traceId,
      },
      status as any,
      { "content-type": "application/problem+json" },
    );
  }

  return c.json(
    {
      type: "https://diopside.dev/problems/internal-error",
      title: "INTERNAL_ERROR",
      status: 500,
      detail: "Unexpected error",
      instance,
      code: "INTERNAL_ERROR",
      retryable: false,
      trace_id: traceId,
    },
    500,
    { "content-type": "application/problem+json" },
  );
};
