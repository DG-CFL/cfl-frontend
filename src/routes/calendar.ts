import CalendarPage from "@/pages/calendar/CalendarPage";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from ".";

export const calendarPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'calendar',
  component: CalendarPage,
})
