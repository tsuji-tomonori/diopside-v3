export type ItemCursor = {
  item_id: string
}

export function encodeCursor(cursor: ItemCursor): string {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url')
}

export function decodeCursor(value: string): ItemCursor | null {
  try {
    const json = Buffer.from(value, 'base64url').toString('utf8')
    const parsed = JSON.parse(json) as Partial<ItemCursor>
    if (!parsed || typeof parsed.item_id !== 'string' || parsed.item_id.length === 0) {
      return null
    }
    return { item_id: parsed.item_id }
  } catch {
    return null
  }
}
