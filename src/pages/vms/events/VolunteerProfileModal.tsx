import type { ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Award, Check, GraduationCap, Loader2, X } from 'lucide-react'

import { getVolunteer } from '@/api/volunteers'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type VolunteerProfileModalProps = {
  volunteerId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VolunteerProfileModal({
  volunteerId,
  open,
  onOpenChange,
}: VolunteerProfileModalProps) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['volunteers', volunteerId],
    queryFn: () => getVolunteer(volunteerId!),
    enabled: open && Boolean(volunteerId),
    staleTime: 5 * 60 * 1000,
  })

  const hasCertificate =
    data?.certificate !== null && data?.certificate !== undefined

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden border border-slate-200 p-0 shadow-xl sm:max-w-md">
        <div className="bg-gradient-to-br from-[#545F71] via-[#5a6579] to-[#3d4552] px-6 pb-8 pt-6 text-white">
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-xl font-semibold tracking-tight text-white">
              Volunteer profile
            </DialogTitle>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Loading…
              </div>
            )}
            {!isLoading && data && (
              <p className="text-2xl font-semibold leading-tight text-white">
                {data.name}
              </p>
            )}
            {!isLoading && isError && (
              <p className="text-sm text-rose-200">
                {error instanceof Error ? error.message : 'Could not load profile.'}
              </p>
            )}
          </DialogHeader>
        </div>

        <div className="space-y-0 bg-slate-50/80 px-6 py-5">
          {data && (
            <>
              <div className="grid gap-3">
                <StatRow
                  icon={<GraduationCap className="size-5 text-[#545F71]" aria-hidden />}
                  label="Activities attended"
                  value={data.eventsAttended ?? 0}
                />
                <StatRow
                  icon={<Award className="size-5 text-[#545F71]" aria-hidden />}
                  label="Training sessions attended"
                  value={data.trainingSessionsAttended ?? 0}
                />
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Certificate
                </p>
                <div className="mt-3 flex items-center gap-3">
                  {hasCertificate ? (
                    <>
                      <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check className="size-7 stroke-[2.5]" aria-hidden />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Certified</p>
                        <p className="text-sm text-slate-500">
                          Certificate on file
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex size-12 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                        <X className="size-7 stroke-[2.5]" aria-hidden />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Not certified</p>
                        <p className="text-sm text-slate-500">No certificate recorded</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="border-t border-slate-200 bg-white px-6 py-4 sm:justify-end">
          <Button
            type="button"
            variant="secondary"
            className="rounded-lg bg-[#545F71] text-white hover:bg-[#454e5f]"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-slate-100"
        aria-hidden
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold tabular-nums text-slate-900">{value}</p>
      </div>
    </div>
  )
}
