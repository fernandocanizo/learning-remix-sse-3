import type { LoaderFunctionArgs } from "@remix-run/node"

import { eventStream } from "remix-utils/sse/server"
import { pubsub } from "~/pubsub"

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return eventStream(request.signal, send => {
    pubsub.on("fake-process-pubsub", (data) => doit(data))

    const doit = async (data: Record<string, string>) => {
      console.debug({dataFromPubSub: data})
      send({
        event: "fake-process-sse",
        data: JSON.stringify({
          processQty: data.processQty,
          processNumber: data.processNumber,
          result: {
            wasProcessSuccessful: data.wasProcessSuccessful,
            error: data.error,
          }
        })
      })
    }
    
    return () => {} // No cleanup needed
  })
}
