import { Link } from '@tanstack/react-router'
import checkIcon from '@/assets/check-icon.svg'

export default function SignUpSuccess() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <img src={checkIcon} />
      <h1>You have successfully signed up!</h1>
      <p className="text-xl">
        Please check your inbox for the confirmation email.
      </p>
      <Link to="/login" className="text-muted-foreground underline">
        Back to Login
      </Link>
    </div>
  )
}
