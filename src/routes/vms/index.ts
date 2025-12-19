import VmsLandingPage from "@/pages/vms/VmsLandingPage";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "../app";


export const landingPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'vms',
  component: VmsLandingPage,
})
