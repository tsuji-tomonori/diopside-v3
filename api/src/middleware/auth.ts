import type { MiddlewareHandler } from "hono";
import { ProblemError } from "../lib/problem.js";
import { createRemoteJWKSet, jwtVerify } from "jose";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

const getJwks = () => {
  if (jwks) return jwks;
  const region = process.env.COGNITO_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  if (!region || !userPoolId) {
    throw new ProblemError({
      status: 500,
      code: "AUTH_CONFIG_ERROR",
      message: "COGNITO_REGION and COGNITO_USER_POOL_ID are required",
    });
  }
  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  jwks = createRemoteJWKSet(new URL(jwksUrl));
  return jwks;
};

export const authRequired: MiddlewareHandler = async (c, next) => {
  if (process.env.JWT_DEV_BYPASS === "1" || process.env.NODE_ENV === "test") {
    await next();
    return;
  }

  const auth = c.req.header("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) {
    throw new ProblemError({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Bearer token is required",
    });
  }

  const token = auth.slice("Bearer ".length).trim();
  if (!token) {
    throw new ProblemError({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Bearer token is empty",
    });
  }

  const region = process.env.COGNITO_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const audience = process.env.COGNITO_AUDIENCE;
  const issuer = process.env.JWT_ISSUER ?? (region && userPoolId ? `https://cognito-idp.${region}.amazonaws.com/${userPoolId}` : undefined);

  if (!issuer) {
    throw new ProblemError({
      status: 500,
      code: "AUTH_CONFIG_ERROR",
      message: "Issuer cannot be resolved",
    });
  }

  try {
    await jwtVerify(token, getJwks(), {
      issuer,
      audience,
      clockTolerance: 5,
    });
  } catch {
    throw new ProblemError({
      status: 401,
      code: "UNAUTHORIZED",
      message: "JWT verification failed",
    });
  }

  await next();
};
