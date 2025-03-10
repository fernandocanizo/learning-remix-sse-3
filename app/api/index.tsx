import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
  return [
    { title: "SSE Demos" },
    { name: "description", content: "Server-sent events demos" },
  ]
}

export default function Index() {
  const urlStyle = "group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500"

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            <abbr title="Server-Sent Events">SSE</abbr> Demos
          </h1>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            Choose a demo:
          </p>
          <ul>
            <li>
              <a
                className={urlStyle}
                href="/time"
              >
                Clock receiving second events from the back-end.
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
