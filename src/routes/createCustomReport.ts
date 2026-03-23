import CreateCustomReportPage from "@/pages/analytics/create-custom-report/CreateCustomReportPage"
import { createRoute } from "@tanstack/react-router"
import { appLayoutRoute } from "./app"

export const createCustomReportRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/create-custom-report",
  component: CreateCustomReportPage,
})
