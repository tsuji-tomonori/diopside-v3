import { OpenAPIHono } from "@hono/zod-openapi";
import { authRequired } from "./middleware/auth.js";
import { onError } from "./middleware/error.js";
import { notFound } from "./middleware/not-found.js";
import { traceMiddleware } from "./middleware/trace.js";
import { store } from "./repositories/store.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { registerOpsRoutes } from "./routes/ops.js";
import { registerPublicRoutes } from "./routes/public.js";

export const buildApp = () => {
  const app = new OpenAPIHono();

  app.use("*", traceMiddleware);
  app.use("/api/v1/*", authRequired);
  app.use("/openapi/*", authRequired);

  registerOpsRoutes(app);
  registerAdminRoutes(app);
  registerPublicRoutes(app);

  app.doc("/openapi/v1/openapi.json", {
    openapi: "3.0.0",
    info: {
      title: "diopside backend api",
      version: "1.0.0",
      description: "Backend API aligned with DD-APP-API-002..015",
    },
  });

  app.get("/openapi/", (c) => {
    const html = `<!doctype html><html><body><h1>OpenAPI</h1><p><a href="/openapi/v1/openapi.json">/openapi/v1/openapi.json</a></p></body></html>`;
    return c.html(html);
  });

  app.get("/bootstrap.json", async (c) => c.json((await store.publicContracts()).bootstrap));
  app.get("/tag_master.json", async (c) => c.json((await store.publicContracts()).tag_master));
  app.get("/archive_index.p0.json", async (c) => c.json((await store.publicContracts()).archive_index));
  app.get("/archive_index.p:page.json", async (c) => {
    return c.json((await store.publicContracts()).archive_index);
  });

  app.notFound(notFound);
  app.onError(onError);
  return app;
};

export type AppType = ReturnType<typeof buildApp>;
