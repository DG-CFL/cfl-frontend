import type { Volunteer } from '@/types/volunteers'

/**
 * Resolves the Firebase / trainer id used for API `trainers` and selection matching.
 */
export function getVolunteerTrainerId(volunteer: Volunteer): string {
  const v = volunteer as Volunteer & {
    firebaseUid?: string
    uid?: string
    userId?: string
  }
  const candidate =
    v.firebaseId ??
    v.firebaseID ??
    v.firebaseUid ??
    v.uid ??
    v.userId ??
    v.id
  if (candidate === null || candidate === undefined) return ''
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
