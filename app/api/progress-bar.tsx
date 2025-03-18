import progressBarCss from "~/styles/progress-bar.css?url"

import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node"
type FakeProcessResult = {
  wasProcessSuccessful: boolean
  error?: string
}

import { useState, useEffect, useCallback } from "react"
import { useActionData, useLoaderData, useFetcher } from "@remix-run/react"
import { useEventSource } from "remix-utils/sse/react"
import { randomUUID } from "node:crypto"

import { decimal, delay, fakeProcessResult } from "~/lib"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: progressBarCss, as: "style" },
]

export const loader = () => {
  return { initialProgress: 0 }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  console.debug("action")
  const formData = await request.formData()
  const processQty = decimal(formData.get("processQty") as string)
  const resultList = []

  for (let processNumber = 1; processNumber <= processQty; processNumber++) {
    await delay()
    const data: FakeProcessResult = {
      wasProcessSuccessful: fakeProcessResult(),
    }

    if (!data.wasProcessSuccessful) {
      data.error = `Device ID: '${randomUUID()}' failed.`
    }
    console.debug(`process: ${processNumber}:`, { data })
    resultList.push(data)

    const queryData = {
      processQty: String(processQty),
      processNumber: String(processNumber),
      wasProcessSuccessful: String(data.wasProcessSuccessful),
      error: data.error ?? "false",
    }

    const queryString = new URLSearchParams(queryData).toString()
    const url = `/res/fake-process?${queryString}`

    // send partial data for the SSE updater
    // fetch(url) // this breaks everything!
  }

  console.debug("finished")
  return {
    resultList,
    finished: true, // TODO I think this is not needed
  }
}

type UiState = "initial" | "sent" | "finished"

export default function ProgressBar() {
  const loaderData = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const fetcher = useFetcher()
  const sseData = useEventSource("/res/fake-process", { event: "fake-process" })
  const [uiState, setUiState] = useState<UiState>("initial")
  const [currentProgress, setCurrentProgress] = useState(loaderData.initialProgress)
  const maxProgress = 1
  const maxProgressContainerWidth = 100 // defined in CSS

  console.debug({sseData})
  if (actionData?.finished) {
    setUiState("finished")
  }

  // this was used by the button, but now it has to be done some other way,
  // cause I removed the button
  // TODO update with data coming on `sseData`
  const increaseProgress = useCallback(() => {
    setCurrentProgress((prev: number) => Math.min(prev, maxProgress))
  }, [maxProgress])

  useEffect(() => { // Ensures this code runs only in the browser
    const progressBar = document.getElementById("progress-bar")
    if (progressBar) {
      progressBar.style.width = `${currentProgress * maxProgressContainerWidth}px`
    }
  }, [currentProgress])

  return (
    <>
      <h1>A progress bar receiving updates from the back-end via SSE</h1>

      <fetcher.Form method="post" onSubmit={() => setUiState("sent")} >
        <label htmlFor="processQty">
          Process quantity ?
          <input type="number" name="processQty" min="1" max="10000" />
        </label>

        <button type="submit" disabled={uiState !== "initial"}>Submit</button>
      </fetcher.Form>

      {uiState === "sent" && sseData ? (
        <>
          <div className="progress-container">
            <div className="progress-bar" id="progress-bar"></div>
          </div>
        </>
      ) : uiState === "finished" ? (
        <>
          <p>ToDo: Show final results</p>
        </>
      )
      : null
      }
    </>
  )
}
