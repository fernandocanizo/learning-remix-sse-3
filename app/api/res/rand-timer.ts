import type { LoaderFunctionArgs } from "@remix-run/node"

import { eventStream } from "remix-utils/sse/server"

// wait between 3 and 10 seconds
const randWait = () => (3 + Math.random() * 7) * 1000

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, send => {
    const timer = setInterval(() => {
      send({ event: "iso8601-rand-time", data: new Date().toISOString() })
    }, randWait())

    const clear = () => clearInterval(timer)

    return clear
  })
}
