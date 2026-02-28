import type { IngestionItem } from '@prisma/client'
import { prisma } from '../db/client.js'
import { encodeCursor } from '../lib/cursor.js'

export type IngestionItemStatusFilter = 'succeeded' | 'failed' | 'unprocessed'

export type ListIngestionItemsParams = {
  run_id: string
  status?: IngestionItemStatusFilter
  cursor?: string
  limit: number
}

export type ListIngestionItemsResult = {
  items: IngestionItem[]
  next_cursor: string | null
}

export async function findIngestionRunById(run_id: string) {
  return prisma.ingestionRun.findUnique({
    where: { run_id },
    select: { run_id: true }
  })
}

export async function listIngestionItemsByRun(
  params: ListIngestionItemsParams
): Promise<ListIngestionItemsResult> {
  const rows = await prisma.ingestionItem.findMany({
    where: {
      run_id: params.run_id,
      ...(params.status ? { status: params.status } : {})
    },
    orderBy: [
      { created_at: 'desc' },
      { item_id: 'desc' }
    ],
    ...(params.cursor
      ? {
          cursor: { item_id: params.cursor },
          skip: 1
        }
      : {}),
    take: params.limit + 1
  })

  const hasNext = rows.length > params.limit
  const items = hasNext ? rows.slice(0, params.limit) : rows
  const tail = items[items.length - 1]

  return {
    items,
    next_cursor: hasNext && tail ? encodeCursor({ item_id: tail.item_id }) : null
  }
}
