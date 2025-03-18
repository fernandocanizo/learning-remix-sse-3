import type { LoaderFunctionArgs } from "@remix-run/node"

import { eventStream } from "remix-utils/sse/server"

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.debug({params})

  return eventStream(request.signal, send => {
    const doit = async () =>
      send({
        event: "fake-process",
        data: JSON.stringify({
          processQty: params.processQty,
          processNumber: params.processNumber,
          result: {
            wasProcessSuccessful: params.wasProcessSuccessful,
            error: params.error,
          }
        })
      })
    
    doit()
    return () => {} // No cleanup needed
  })
}
