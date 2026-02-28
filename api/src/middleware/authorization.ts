import type { MiddlewareHandler } from "hono";
import { ProblemError } from "../lib/problem.js";

const hasAny = (source: string[], expected: string[]) => expected.some((value) => source.includes(value));

const requireClaims = (opts: { scopes?: string[]; groups?: string[] }): MiddlewareHandler => {
  return async (c, next) => {
    if (process.env.JWT_DEV_BYPASS === "1" || process.env.NODE_ENV === "test") {
      await next();
      return;
    }

    const scopes = c.get("auth_scope") ?? [];
    const groups = c.get("auth_groups") ?? [];

    const scopeOk = !opts.scopes || hasAny(scopes, opts.scopes);
    const groupOk = !opts.groups || hasAny(groups, opts.groups);

    if (!scopeOk && !groupOk) {
      throw new ProblemError({ status: 403, code: "FORBIDDEN", message: "Insufficient privileges" });
    }

    await next();
  };
};

export const requireAdmin = requireClaims({ scopes: ["admin"], groups: ["admin"] });

export const requireE2ETest = requireClaims({ scopes: ["e2e:test", "e2e"], groups: ["e2e-test"] });
