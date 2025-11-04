import checkIcon from '@/assets/check-icon.svg'

export default function CreateEditEventSuccess() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <img src={checkIcon} />
      <h1>Your event has been successfully created/updated</h1>
      <p className="text-center text-xl font-normal leading-7">
        It might take a few minutes for the changes to reflect on the main page
      </p>
    </div>
  )
}
