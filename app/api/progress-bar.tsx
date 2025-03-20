import progressBarCss from "~/styles/progress-bar.css?url"

import type { ActionFunctionArgs, LinksFunction } from "@remix-run/node"
type FakeProcessResult = {
  wasProcessSuccessful: boolean
  error?: string
}

import { useState, useEffect } from "react"
import { useActionData, useLoaderData, useFetcher } from "@remix-run/react"
import { useEventSource } from "remix-utils/sse/react"
import { randomUUID } from "node:crypto"
import { pubsub } from "~/pubsub"

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

    pubsub.emit("fake-process-pubsub", {
      processQty,
      processNumber,
      wasProcessSuccessful: data.wasProcessSuccessful,
      error: data.error ?? "false",
    })
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
  const sseData = useEventSource("/res/fake-process", { event: "fake-process-sse" })
  const [uiState, setUiState] = useState<UiState>("initial")
  const [currentProgress, setCurrentProgress] = useState(loaderData.initialProgress)
  const maxProgressContainerWidth = 100 // defined in CSS

  console.debug("=======================================")
  console.debug({loaderData})
  console.debug({actionData})
  console.debug({sseData})
  console.debug({uiState})
  console.debug("=======================================")

  if (actionData?.finished) {
    setUiState("finished")
  }

  useEffect(() => { // Ensures this code runs only in the browser
    if (sseData) {
      const sseDataObj = JSON.parse(sseData)
      const processQty = decimal(sseDataObj.processQty)
      const processNumber = decimal(sseDataObj.processNumber)
      const newProgress = (processNumber / processQty) * maxProgressContainerWidth
      setCurrentProgress(Math.min(newProgress, maxProgressContainerWidth))
    }

    const progressBar = document.getElementById("progress-bar")
    if (progressBar) {
      progressBar.style.width = `${currentProgress * maxProgressContainerWidth}px`
    }
  }, [currentProgress, sseData])

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
