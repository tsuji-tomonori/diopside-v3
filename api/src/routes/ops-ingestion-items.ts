import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { ApiError } from '../lib/errors.js'
import { decodeCursor } from '../lib/cursor.js'
import type { AppEnv } from '../types/env.js'
import {
  findIngestionRunById,
  listIngestionItemsByRun,
  type IngestionItemStatusFilter
} from '../repositories/ingestion-items-repository.js'

const paramsSchema = z.object({
  runId: z.string().uuid().openapi({
    param: {
      name: 'runId',
      in: 'path'
    },
    example: '4d64de6a-e7c3-4050-8544-9c5a388d5eec'
  })
})

const querySchema = z.object({
  status: z.enum(['succeeded', 'failed', 'unprocessed']).optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).default(100)
})

const responseSchema = z.object({
  run_id: z.string().uuid(),
  items: z.array(
    z.object({
      video_id: z.string(),
      status: z.string(),
      failure_reason_code: z.string().nullable(),
      failure_scope: z.string().nullable(),
      update_type: z.string(),
      source_type: z.string(),
      processed_at: z.string().datetime().nullable(),
      trace_id: z.string()
    })
  ),
  next_cursor: z.string().nullable(),
  trace_id: z.string()
})

const route = createRoute({
  method: 'get',
  path: '/api/v1/ops/ingestion/runs/{runId}/items',
  tags: ['ops-ingestion'],
  operationId: 'getIngestionRunItems',
  summary: '収集結果明細を取得',
  request: {
    params: paramsSchema,
    query: querySchema
  },
  responses: {
    200: {
      description: 'Ingestion item list',
      content: {
        'application/json': {
          schema: responseSchema
        }
      }
    },
    400: {
      description: 'Bad request'
    },
    404: {
      description: 'Run not found'
    }
  }
})

export const opsIngestionItemsApp = new OpenAPIHono<AppEnv>()

opsIngestionItemsApp.openapi(route, async (c) => {
  const { runId } = c.req.valid('param')
  const { status, cursor, limit } = c.req.valid('query')

  let cursorId: string | undefined
  if (cursor) {
    const decoded = decodeCursor(cursor)
    if (!decoded) {
      throw new ApiError(400, 'INVALID_CURSOR', 'cursor is invalid')
    }
    cursorId = decoded.item_id
  }

  const run = await findIngestionRunById(runId)
  if (!run) {
    throw new ApiError(404, 'RUN_NOT_FOUND', 'run not found')
  }

  const result = await listIngestionItemsByRun({
    run_id: runId,
    status: status as IngestionItemStatusFilter | undefined,
    cursor: cursorId,
    limit
  })

  const traceId = c.get('trace_id') as string

  return c.json({
    run_id: runId,
    items: result.items.map((item) => ({
      video_id: item.video_id,
      status: item.status,
      failure_reason_code: item.failure_reason_code,
      failure_scope: item.failure_scope,
      update_type: item.update_type,
      source_type: item.source_type,
      processed_at: item.processed_at ? item.processed_at.toISOString() : null,
      trace_id: item.trace_id
    })),
    next_cursor: result.next_cursor,
    trace_id: traceId
  })
})
