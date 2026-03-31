import type { Volunteer } from '@/types/volunteers'

/**

 */
export function getVolunteerTrainerId(volunteer: Volunteer): string {
  const v = volunteer as Volunteer & { volunteer_id?: string }
  const candidate = v.volunteerId ?? v.volunteer_id ?? v.id
  if (candidate === undefined) return ''
  const s = typeof candidate === 'string' ? candidate.trim() : String(candidate)
  return s
}

/**
 * True if this volunteer row is in the selected list. Uses reference equality first,
 * then id match only when both sides have a non-empty resolved id (avoids "" matching everyone).
 */
export function isVolunteerSelected(
  volunteer: Volunteer,
  selected: Array<Volunteer>,
): boolean {
  return selected.some((s) => {
    if (s === volunteer) return true
    const a = getVolunteerTrainerId(s)
    const b = getVolunteerTrainerId(volunteer)
    if (!a || !b) return false
    return a === b
  })
}
