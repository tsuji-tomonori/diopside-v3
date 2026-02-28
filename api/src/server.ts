import { OpenAPIHono } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { randomUUID } from 'node:crypto'
import { ApiError } from './lib/errors.js'
import { prisma } from './db/client.js'
import { opsIngestionItemsApp } from './routes/ops-ingestion-items.js'
import type { AppEnv } from './types/env.js'

export function createServer() {
  const app = new OpenAPIHono<AppEnv>()

  app.use('*', async (c, next) => {
    const traceId = c.req.header('x-request-id') ?? randomUUID()
    c.set('trace_id', traceId)
    c.header('x-request-id', traceId)
    await next()
  })

  app.route('/', opsIngestionItemsApp)

  app.get('/api/v1/ops/diagnostics/health', async (c) => {
    const traceId = c.get('trace_id') as string

    let dbStatus: 'ok' | 'error' = 'ok'
    try {
      await prisma.$queryRaw`SELECT 1`
    } catch {
      dbStatus = 'error'
    }

    const status: 'ok' | 'degraded' = dbStatus === 'ok' ? 'ok' : 'degraded'

    return c.json({
      status,
      checks: {
        db: dbStatus,
        s3: 'unknown'
      },
      trace_id: traceId
    })
  })

  app.notFound((c) => {
    const traceId = c.get('trace_id') as string
    return c.json(
      {
        code: 'NOT_FOUND',
        message: 'resource not found',
        trace_id: traceId
      },
      404
    )
  })

  app.onError((err, c) => {
    const traceId = c.get('trace_id') as string

    if (err instanceof ApiError) {
      c.status(err.status as 400 | 401 | 403 | 404 | 409 | 422 | 429)
      return c.json({
        code: err.code,
        message: err.message,
        trace_id: traceId
      })
    }

    if (err instanceof HTTPException) {
      return c.json(
        {
          code: 'HTTP_ERROR',
          message: err.message,
          trace_id: traceId
        },
        err.status
      )
    }

    return c.json(
      {
        code: 'INTERNAL_ERROR',
        message: 'internal server error',
        trace_id: traceId
      },
      500
    )
  })

  return app
}
