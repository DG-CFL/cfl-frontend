import { useEffect, useState } from 'react'
import axios from 'axios'
import { CheckCircle2, User } from 'lucide-react'

import type { Volunteer } from '@/types/volunteers'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  getVolunteerFirebaseId,
  volunteerHasCertificate,
} from '@/lib/volunteerUtils'
import { useGetVolunteer, useUpdateVolunteer } from '@/operations/volunteers'

type VolunteerInformationPageProps = {
  volunteer: Volunteer
}

function capitalizeGender(g: string): string {
  if (!g) return '—'
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()
}

/** e.g. "Tarin Pairor" → "tarin_pairor_lvl1.pdf" */
function certificateFilenameFromVolunteerName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
  return `${slug || 'volunteer'}_lvl1.pdf`
}

/** Local calendar date at midnight, e.g. 2026-04-05T00:00:00 */
function certificationDateForApi(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}T00:00:00`
}

function apiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { detail?: unknown } | undefined
    if (typeof data?.detail === 'string') {
      return data.detail
    }
  }
  if (err instanceof Error) {
    return err.message
  }
  return 'Something went wrong'
}

export function VolunteerInformationPage({
  volunteer: volunteerFromList,
}: VolunteerInformationPageProps) {
  const volunteerId = getVolunteerFirebaseId(volunteerFromList)

  const { data: volunteerDetail, isLoading: detailLoading } =
    useGetVolunteer(volunteerId)
  const displayVolunteer = volunteerDetail ?? volunteerFromList
  const resolvingDetail = Boolean(volunteerId) && detailLoading

  const certifyMutation = useUpdateVolunteer(volunteerId)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [certifyError, setCertifyError] = useState<string | null>(null)

  const emailOptIn = displayVolunteer.emailOptIn === true
  const eventsAttended = displayVolunteer.eventsAttended ?? 0
  const trainingSessionsAttended =
    displayVolunteer.trainingSessionsAttended ?? 0
  const cert = displayVolunteer.certificate
  const activeCert = volunteerHasCertificate(cert) ? cert : null

  useEffect(() => {
    if (!confirmOpen) {
      setCertifyError(null)
    }
  }, [confirmOpen])

  const handleConfirmCertify = async () => {
    setCertifyError(null)
    if (!volunteerId) {
      setCertifyError('Missing volunteer id.')
      return
    }
    const certificate = certificateFilenameFromVolunteerName(
      displayVolunteer.name,
    )
    const certificationDate = certificationDateForApi()
    try {
      await certifyMutation.mutateAsync({
        certificate,
        certificationDate,
      })
      setConfirmOpen(false)
      setSuccessOpen(true)
    } catch (e) {
      setCertifyError(apiErrorMessage(e))
    }
  }

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
                {displayVolunteer.name}
              </h2>
              <p className="text-base text-slate-800">
                Age : {displayVolunteer.age}
              </p>
              <p className="text-base capitalize text-slate-800">
                {capitalizeGender(displayVolunteer.gender)}
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
        <CardContent className="space-y-4 pb-6 pt-0">
          {resolvingDetail ? (
            <p className="text-base text-slate-600">
              Loading certification status…
            </p>
          ) : activeCert ? (
            <div className="space-y-2 text-base text-slate-800">
              <a
                href={activeCert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#545F71] underline underline-offset-2 hover:text-[#3d4552]"
              >
                View certificate
              </a>
              {activeCert.date ? (
                <p className="text-sm text-slate-600">
                  Issued:{' '}
                  {new Date(activeCert.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-base font-medium text-slate-800">
                Not certified
              </p>
              {volunteerId ? (
                <Button
                  type="button"
                  className="h-10 rounded-lg bg-[#545F71] px-4 text-sm font-semibold text-white hover:bg-[#3d4552]"
                  onClick={() => setConfirmOpen(true)}
                >
                  Certify this person
                </Button>
              ) : (
                <p className="text-sm text-slate-600">
                  Volunteer id is missing; cannot certify from this record.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="border-slate-300 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Certify this volunteer?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This will record a level 1 certificate for{' '}
            <span className="font-medium text-slate-900">
              {displayVolunteer.name}
            </span>{' '}
            with file{' '}
            <span className="font-mono text-xs">
              {certificateFilenameFromVolunteerName(displayVolunteer.name)}
            </span>{' '}
            and today&apos;s date.
          </p>
          {certifyError ? (
            <p className="text-sm text-red-600">{certifyError}</p>
          ) : null}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={certifyMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#545F71] hover:bg-[#3d4552]"
              onClick={handleConfirmCertify}
              disabled={certifyMutation.isPending}
            >
              {certifyMutation.isPending ? 'Certifying…' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="border-slate-300 sm:max-w-md">
          <DialogHeader className="sr-only">
            <DialogTitle>Certification complete</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <CheckCircle2 className="size-14 text-[#76B043]" aria-hidden />
            <p className="text-lg font-semibold text-slate-900">
              Successfully certified
            </p>
            <Button
              type="button"
              className="bg-[#545F71] hover:bg-[#3d4552]"
              onClick={() => setSuccessOpen(false)}
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
