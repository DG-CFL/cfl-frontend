import { Link } from '@tanstack/react-router'
import logo from '@/assets/cfl-logo.png'

export default function ResetPasswordEmail() {
  return (
    <div className="w-1/2 inline-flex gap-8 items-center">
      <img src={logo} alt="CFL Logo" />
      <div className='flex flex-col justify-center items-start gap-4'>
        <h1>Check your email</h1>
        <p className="text-xl">
          If your account exists, an email including instructions on how to
          reset your password will be sent
        </p>
        <Link to="/login" className="text-muted-foreground underline">
          Back to Login Page
        </Link>
      </div>
    </div>
  )
}
