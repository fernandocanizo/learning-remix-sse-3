import progressBarCss from "~/styles/progress-bar.css?url"

import { useState, useEffect, useCallback } from "react"
import { useLoaderData } from "@remix-run/react"
import type { LinksFunction } from "@remix-run/node"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: progressBarCss, as: "style" },
]

export const loader = () => {
  return { initialProgress: 0 }
}

export default function ProgressBar() {
  const loaderData = useLoaderData<typeof loader>()
  const [currentProgress, setCurrentProgress] = useState(loaderData.initialProgress)
  const maxProgress = 1
  const step = 0.01

  const increaseProgress = useCallback(() => {
    setCurrentProgress((prev: number) => Math.min(prev + step, maxProgress))
  }, [maxProgress, step])

  useEffect(() => {
    // Ensure this code runs only in the browser
    const progressBar = document.getElementById("progress-bar")
    if (progressBar) {
      progressBar.style.width = `${currentProgress * 100}px`
    }
  }, [currentProgress])

  return (
    <>
      <div className="progress-container">
        <div className="progress-bar" id="progress-bar"></div>
      </div>

      <button onClick={increaseProgress}>Increase Progress</button>
    </>
  )
}
