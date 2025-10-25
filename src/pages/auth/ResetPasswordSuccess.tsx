import { Link } from '@tanstack/react-router'
import checkIcon from '@/assets/check-icon.svg'

export default function ResetPasswordSuccess() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <img src={checkIcon} />
      <h1>Password Reset!</h1>
      <Link to="/login" className="text-muted-foreground underline">
        Back to Login Page
      </Link>
    </div>
  )
}
