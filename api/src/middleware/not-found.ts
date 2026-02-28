import type { Context } from "hono";

export const notFound = (c: Context) => {
  const traceId = c.get("trace_id") ?? "unknown";
  return c.json(
    {
      type: "https://diopside.dev/problems/not-found",
      title: "NOT_FOUND",
      status: 404,
      detail: "Route not found",
      instance: c.req.path,
      code: "NOT_FOUND",
      retryable: false,
      trace_id: traceId,
    },
    404,
    { "content-type": "application/problem+json" },
  );
};
