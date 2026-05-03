import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { router } from './modules/router'

const app = new Hono().route("/", router)

app.get('/', (c) => {
  const _data = "hello!"
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
