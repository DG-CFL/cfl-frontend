import { createRoute } from "@tanstack/react-router"
import { appLayoutRoute } from "./app"
import TrainerBookingPage from "@/pages/trainer-booking/TrainerBookingPage"

export const trainerBookingRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/trainer-booking",
  component: TrainerBookingPage,
})
