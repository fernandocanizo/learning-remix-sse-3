import { useLoaderData } from "@remix-run/react"
import { useEventSource } from "remix-utils/sse/react"

export const loader = async () => {
  return { time: new Date().toISOString() }
}

export default function Time() {
  const loaderData = useLoaderData<typeof loader>()
  const time = useEventSource("/res/timer", { event: "iso8601-timedate" }) ?? loaderData.time

  return (
    <>
      <h1>A clock, but receiving the time from the back-end via SSE</h1>
      <time dateTime={time}>
        {new Date(time).toLocaleTimeString("en", {
          minute: "2-digit",
          second: "2-digit",
          hour: "2-digit",
        })}
      </time>
    </>
  )
}
