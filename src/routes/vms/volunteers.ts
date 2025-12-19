import VolunteerPage from "@/pages/vms/volunteers/VolunteerPage";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "../app";

export const volunteerPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'volunteers',
  component: VolunteerPage,
})
