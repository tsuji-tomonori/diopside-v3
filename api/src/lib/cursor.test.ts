import test from 'node:test'
import assert from 'node:assert/strict'
import { decodeCursor, encodeCursor } from './cursor.js'

test('round-trips item_id cursor', () => {
  const encoded = encodeCursor({ item_id: '6d1deb1c-5f05-412e-b317-f95a0f6f8ac4' })
  assert.deepEqual(decodeCursor(encoded), { item_id: '6d1deb1c-5f05-412e-b317-f95a0f6f8ac4' })
})

test('returns null for malformed value', () => {
  assert.equal(decodeCursor('not-a-valid-cursor'), null)
})
