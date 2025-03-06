import type { LoaderFunctionArgs } from "@remix-run/node"

import { eventStream } from "remix-utils/sse/server"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, send => {
    const timer = setInterval(() => {
      send({ event: "iso8601-timedate", data: new Date().toISOString() })
    }, Math.random() * 1000)

    const clear = () => clearInterval(timer)

    return clear
  })
}
