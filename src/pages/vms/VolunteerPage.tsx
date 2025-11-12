import { VolunteerTable } from './VolunteerTable.tsx'

import { VolunteerInformationPage } from './VolunteerInformationPage.tsx'
import { useState } from 'react'

import { ChevronLeft } from 'lucide-react'
import type { Volunteer } from '@/types/vms.tsx'

export default function VolunteerPage() {
  const [clickedRow, setClickedRow] = useState<Volunteer | null>(null)
  const backFunc = () => {
    setClickedRow(null)
  }

  return clickedRow ? (
    <div className="p-5 h-screen w-screen flex flex-col">
      <div className="flex justify-between h-16">
        <div className="flex flex-start">
          <ChevronLeft
            strokeWidth={2}
            size={52}
            className="mx-5"
            onClick={backFunc}
          />
          <h1> Volunteer Information </h1>
        </div>
      </div>
      <div className="grow">
        <VolunteerInformationPage clickedRow={clickedRow} />
      </div>
    </div>
  ) : (
    <div className="p-5">
      <div className="flex justify-between h-16">
        <h1> Volunteer Information </h1>
      </div>
      <VolunteerTable setClickedRow={setClickedRow} />
    </div>
  )
}
