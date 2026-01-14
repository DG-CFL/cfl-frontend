import checkIcon from '@/assets/check-icon.svg'
import { useNavigate } from '@tanstack/react-router'

export default function CreateEventSuccess() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex min-h-screen w-[calc(100vw-250px)] flex-col items-center justify-center gap-4 text-center">
      <img src={checkIcon} alt="Success" />
      <h1>Event successfully created</h1>
      <p className="text-center text-xl font-normal leading-7">
        It might take a few minutes for the changes to reflect on the main page
      </p>
      <p
        className="mt-2 cursor-pointer text-xl font-semibold text-[#545f71] underline"
        onClick={() => navigate({ to: '/events' })}
      >
        Back to Events Page
      </p>
    </div>
  )
}
