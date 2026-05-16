import type { Volunteer } from '@/types/volunteers'

/** Resolve Firebase UID from list/detail volunteer payloads (handles stray snake_case). */
export function getVolunteerFirebaseId(v: Volunteer): string {
  const extended = v as Volunteer & { volunteer_id?: string }
  const id = v.volunteerId ?? v.id ?? extended.volunteer_id
  return typeof id === 'string' ? id.trim() : ''
}

/** True when API returned a certificate with a non-empty link (show View certificate). */
export function volunteerHasCertificate(
  cert: Volunteer['certificate'],
): cert is NonNullable<Volunteer['certificate']> & { link: string } {
  if (!cert || typeof cert !== 'object' || !('link' in cert)) {
    return false
  }
  const link = cert.link
  return typeof link === 'string' && link.trim().length > 0
}
