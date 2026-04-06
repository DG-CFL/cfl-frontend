/** Google Calendar "add event" template uses UTC timestamps without separators. */
function formatDateUtcForGoogleCalendar(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value)
}

export function buildGoogleCalendarEventUrl(params: {
  title: string
  details: string
  location: string
  start: Date | string
  end: Date | string
}): string {
  let start = toDate(params.start)
  let end = toDate(params.end)
  if (Number.isNaN(start.getTime())) start = new Date()
  if (Number.isNaN(end.getTime())) end = start
  if (end.getTime() < start.getTime()) end = start

  const dates = `${formatDateUtcForGoogleCalendar(start)}/${formatDateUtcForGoogleCalendar(end)}`
  const search = new URLSearchParams({
    action: 'TEMPLATE',
    text: params.title,
    details: params.details,
    location: params.location,
    dates,
  })
  return `https://calendar.google.com/calendar/render?${search.toString()}`
}
