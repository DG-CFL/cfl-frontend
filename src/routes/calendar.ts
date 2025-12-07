import CalendarPage from "@/pages/calendar/CalendarPage";
import { createRoute } from "@tanstack/react-router";
import { appLayoutRoute } from "./app";

export const calendarPageRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: 'calendar',
  component: CalendarPage,
})
