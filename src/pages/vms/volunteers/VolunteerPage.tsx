import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { Volunteer } from '@/types/volunteers'

import { VolunteerInformationPage } from './VolunteerInformationPage'
import { VolunteerTable } from './VolunteerTable'

export default function VolunteerPage() {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null,
  )

  if (selectedVolunteer) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F0F0F0]">
        <header className="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-[#F0F0F0] px-4 py-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 rounded-lg border border-slate-300 bg-white"
            onClick={() => setSelectedVolunteer(null)}
            aria-label="Back to volunteer list"
          >
            <ChevronLeft className="size-7" strokeWidth={2} />
          </Button>
          <h1 className="text-2xl font-semibold text-slate-900">
            Volunteer Information
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto">
          <VolunteerInformationPage volunteer={selectedVolunteer} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-6">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">
        Volunteer Information
      </h1>
      <VolunteerTable setClickedRow={setSelectedVolunteer} />
    </div>
  )
}
