import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./app";
import AnalyticsPage from "@/pages/analytics/AnalyticsPage";
import AnalyticsPdfPreviewPage from "@/pages/analytics/AnalyticsPdfPreviewPage";

export const analyticsPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/analytics",
  component: AnalyticsPage,
});

export const analyticsPdfPreviewRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/analytics/pdf-preview",
  component: AnalyticsPdfPreviewPage,
});

