import { User } from 'lucide-react'

import type { Volunteer } from '@/types/volunteers'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type VolunteerInformationPageProps = {
  volunteer: Volunteer
}

function capitalizeGender(g: string): string {
  if (!g) return '—'
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
}

export function VolunteerInformationPage({
  volunteer,
}: VolunteerInformationPageProps) {
  const emailOptIn = volunteer.emailOptIn === true
  const eventsAttended = volunteer.eventsAttended ?? 0
  const trainingSessionsAttended = volunteer.trainingSessionsAttended ?? 0
  const cert = volunteer.certificate

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6">
      <Card className="rounded-xl border-2 border-slate-900 bg-white shadow-sm">
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex size-28 shrink-0 items-center justify-center rounded-lg border-2 border-slate-200 bg-slate-100">
              <User className="size-14 text-slate-400" strokeWidth={1.25} aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {volunteer.name}
              </h2>
              <p className="text-base text-slate-800">
                Age : {volunteer.age}
              </p>
              <p className="text-base capitalize text-slate-800">
                {capitalizeGender(volunteer.gender)}
              </p>
              <p className="text-base text-slate-800">
                Email Notification Opt-In: {emailOptIn ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-3 border-t border-slate-200 pt-6">
            <p className="text-base text-slate-800">
              <span className="font-medium">Numbers of activities attended:</span>{' '}
              <span className="tabular-nums">{eventsAttended}</span>
            </p>
            <p className="text-base text-slate-800">
              <span className="font-medium">
                Numbers of training sessions attended:
              </span>{' '}
              <span className="tabular-nums">{trainingSessionsAttended}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-2 border-slate-900 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-xl font-bold text-slate-900">
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-6 pt-0">
          {cert && typeof cert === 'object' && cert.link ? (
            <div className="space-y-2 text-base text-slate-800">
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#545F71] underline underline-offset-2 hover:text-[#3d4552]"
              >
                View certificate
              </a>
              {cert.date ? (
                <p className="text-sm text-slate-600">
                  Issued:{' '}
                  {new Date(cert.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-base text-slate-600">—</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
