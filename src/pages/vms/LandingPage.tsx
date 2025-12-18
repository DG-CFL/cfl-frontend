import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'
import { EventCard } from '@/components/ui_custom/EventCard'
import { eventListData } from '@/data/events'
import { Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'

export default function LandingPage() {
  const volunteerIconUrl = null; 
  return (
    <div className="mx-auto w-full space-y-12 px-10 py-14">
      <div className="flex flex-col text-center items-center justify-center p-10  ">
        <h1>Welcome to the Volunteer Management System!</h1>
        <p className='m-4'> Select an action to get started and manage your initiatives </p>

        <div className='w-3/4 flex flex-row p-10 justify-around items-center'>
          <Link to="/volunteers">
            <Sheet>    
              <div className="w-90 h-80 rounded-md bg-[#DADBDD] flex flex-col justify-center items-center ">
                <div className='h-25 w-25 border-4 border-gray-500 p-0 m-0'> 
                  {volunteerIconUrl ? (
                    <img
                      src={volunteerIconUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className="size-full text-muted-foreground/30"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <line
                        x1="10"
                        y1="10"
                        x2="90"
                        y2="90"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <line
                        x1="90"
                        y1="10"
                        x2="10"
                        y2="90"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  )}
                  </div>
                  <h3 className='m-5'>Manage Volunteers</h3>
                  <p>Oversee your volunteer base, manage profiles, and track engagement</p>
              </div>
            </Sheet>
          </Link>
          <Link to="/events">
            <Sheet>    
              <div className="w-90 h-80 rounded-md bg-[#DADBDD] flex flex-col justify-center items-center ">
                <div className='h-25 w-25 border-4 border-gray-500 p-0 m-0'> 
                  {volunteerIconUrl ? (
                    <img
                      src={volunteerIconUrl}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className="size-full text-muted-foreground/30"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <line
                        x1="10"
                        y1="10"
                        x2="90"
                        y2="90"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <line
                        x1="90"
                        y1="10"
                        x2="10"
                        y2="90"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                    </svg>
                  )}
                  </div>
                  <h3 className='m-5'>Manage Events</h3>
                  <p className='px-4'>Organise and schedule events, assign tasks, and track participation</p>
              </div>
            </Sheet>
          </Link>
        </div>
      </div>
    </div>
  )
}
