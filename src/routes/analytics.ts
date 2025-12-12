import AnalyticsPage from "@/pages/analytics/AnalyticsPage";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./app";

export const analyticsPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

