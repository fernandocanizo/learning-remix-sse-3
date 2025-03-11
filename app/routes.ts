import type { RouteConfig } from "@remix-run/route-config"

import { route, index } from "@remix-run/route-config"

export default [
  index("./api/index.tsx"),

  route("time", "./api/time.tsx"),
  route("growing-list", "./api/growing-list.tsx"),
  route("progress-bar", "./api/progress-bar.tsx"),

  // Resource routes don't have layout
  route("res/timer", "./api/res/timer.ts"),
  route("res/rand-timer", "./api/res/rand-timer.ts"),
] satisfies RouteConfig
