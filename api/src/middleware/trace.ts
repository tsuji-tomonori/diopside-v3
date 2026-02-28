import type { MiddlewareHandler } from "hono";
import { newId } from "../lib/id.js";

export const traceMiddleware: MiddlewareHandler = async (c, next) => {
  const traceId = c.req.header("x-request-id") ?? c.req.header("traceparent") ?? newId();
  c.set("trace_id", traceId);
  await next();
  c.header("x-request-id", traceId);
};
