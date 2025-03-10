import { useState, useEffect } from "react"
import { useLoaderData } from "@remix-run/react"
import { useEventSource } from "remix-utils/sse/react"

export const loader = async () => {
  return { time: new Date().toISOString() }
}

export default function GrowingList() {
  const loaderData = useLoaderData<typeof loader>()
  const time = useEventSource("/res/rand-timer", { event: "iso8601-rand-time" })
  const [times, setTimes] = useState<string[]>([loaderData.time])

  useEffect(() => {
    if (time) {
      setTimes((prevTimes) => [...prevTimes, time])
    }
  }, [time])

  return (
    <ul id="time-list">
      {times.map((time, index) => (
        <li key={index}>Time: {time}</li>
      ))}
    </ul>
  )
}
