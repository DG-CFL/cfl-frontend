import LandingPage from "@/pages/vms/LandingPage";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./app";

export const landingPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'landing',
  component: LandingPage,
})
