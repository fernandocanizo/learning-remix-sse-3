import type { RouteConfig } from "@remix-run/route-config"

import { route, index } from "@remix-run/route-config"

export default [
  index(".api/index.tsx"),

  // Resource routes don't have layout
  route("res/timer", "./api/res/timer.ts"),
] satisfies RouteConfig
