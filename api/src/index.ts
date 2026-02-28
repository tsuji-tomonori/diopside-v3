import { serve } from '@hono/node-server'
import { createServer } from './server.js'

const port = Number(process.env.PORT ?? 3000)
const app = createServer()

serve(
  {
    fetch: app.fetch,
    port
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`diopside-api listening on http://localhost:${info.port}`)
  }
)
