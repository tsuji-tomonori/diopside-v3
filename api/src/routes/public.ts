import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { store } from "../repositories/store.js";

const bootstrapRoute = createRoute({
  method: "get",
  path: "/api/v1/public/bootstrap",
  operationId: "getBootstrapContract",
  tags: ["public-contract"],
  responses: {
    200: {
      description: "Bootstrap contract",
      content: {
        "application/json": {
          schema: z.object({
            schema_version: z.string(),
            bootstrap_version: z.string(),
            generated_at: z.string().datetime(),
            tag_master_version: z.string(),
            archive_version: z.string(),
            tag_types: z.array(z.object({ id: z.number(), key: z.string(), name: z.string() })),
            tag_preview: z.array(z.array(z.union([z.string(), z.number()]))),
            latest: z.array(z.array(z.union([z.string(), z.number(), z.array(z.number())]))),
            next: z.object({
              tag_master: z.object({ url: z.string() }),
              archive_index: z.object({ url_pattern: z.string(), page_size: z.number() }),
            }),
          }),
        },
      },
    },
  },
});

const tagMasterRoute = createRoute({
  method: "get",
  path: "/api/v1/public/tag-master",
  operationId: "getTagMasterContract",
  tags: ["public-contract"],
  responses: {
    200: {
      description: "Tag master contract",
      content: {
        "application/json": {
          schema: z.object({
            schema_version: z.string(),
            tag_master_version: z.string(),
            generated_at: z.string().datetime(),
            tag_types: z.array(z.object({ id: z.number(), key: z.string(), name: z.string() })),
            tags: z.array(z.array(z.union([z.number(), z.string()]))),
          }),
        },
      },
    },
  },
});

const archiveIndexRoute = createRoute({
  method: "get",
  path: "/api/v1/public/archive-index",
  operationId: "getArchiveIndexContract",
  tags: ["public-contract"],
  request: {
    query: z.object({ page: z.coerce.number().int().min(0).default(0) }),
  },
  responses: {
    200: {
      description: "Archive index contract",
      content: {
        "application/json": {
          schema: z.object({
            schema_version: z.string(),
            archive_version: z.string(),
            tag_master_version: z.string(),
            generated_at: z.string().datetime(),
            page: z.number(),
            page_size: z.number(),
            total: z.number(),
            items: z.array(z.array(z.union([z.string(), z.number(), z.array(z.number())]))),
          }),
        },
      },
    },
  },
});

const searchRoute = createRoute({
  method: "get",
  path: "/api/v1/search",
  operationId: "searchVideos",
  tags: ["public-query"],
  request: {
    query: z.object({ q: z.string().default("") }),
  },
  responses: {
    200: {
      description: "Search result",
      content: {
        "application/json": {
          schema: z.object({
            items: z.array(
              z.object({
                video_id: z.string(),
                title: z.string(),
                published_at: z.string().datetime(),
                duration_sec: z.number(),
                tag_ids: z.array(z.string()),
              }),
            ),
          }),
        },
      },
    },
  },
});

const detailRoute = createRoute({
  method: "get",
  path: "/api/v1/videos/{videoId}",
  operationId: "getVideoDetail",
  tags: ["public-query"],
  request: {
    params: z.object({ videoId: z.string().openapi({ param: { name: "videoId", in: "path" } }) }),
  },
  responses: {
    200: {
      description: "Video detail",
      content: {
        "application/json": {
          schema: z.object({
            video_id: z.string(),
            title: z.string(),
            published_at: z.string().datetime(),
            duration_sec: z.number(),
            tag_ids: z.array(z.string()),
          }),
        },
      },
    },
  },
});

export const registerPublicRoutes = (app: OpenAPIHono<any>) => {
  app.openapi(bootstrapRoute, (async (c: any) => c.json((await store.publicContracts()).bootstrap)) as any);
  app.openapi(tagMasterRoute, (async (c: any) => c.json((await store.publicContracts()).tag_master)) as any);
  app.openapi(archiveIndexRoute, (async (c: any) => {
    const contract = (await store.publicContracts()).archive_index;
    const q = c.req.valid("query");
    return c.json({ ...contract, page: q.page });
  }) as any);
  app.openapi(searchRoute, (async (c: any) => {
    const { q } = c.req.valid("query");
    return c.json({ items: await store.search(q) });
  }) as any);
  app.openapi(detailRoute, (async (c: any) => {
    const { videoId } = c.req.valid("param");
    const video = await store.getVideo(videoId);
    return c.json({
      ...video,
      watch_url: `https://www.youtube.com/watch?v=${video.video_id}`,
      embed_url: `https://www.youtube.com/embed/${video.video_id}`,
    });
  }) as any);
};
