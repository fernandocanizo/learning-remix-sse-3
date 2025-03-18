import type { LoaderFunctionArgs } from "@remix-run/node"

import { eventStream } from "remix-utils/sse/server"

// wait between 1 and 3 seconds
const randWait = () => (1 + Math.random() * 3) * 1000

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, send => {
    const timer = setInterval(() => {
      send({ event: "iso8601-rand-time", data: new Date().toISOString() })
    }, randWait())

    const clear = () => clearInterval(timer)

    return clear
  })
}
