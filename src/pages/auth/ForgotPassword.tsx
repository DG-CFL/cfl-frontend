import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Link } from '@tanstack/react-router'

export default function ForgotPassword() {
  return (
    <div className="w-3/4 m-auto flex flex-col items-center gap-8 ">
      <h1>Forgot Password</h1>
      <p>Enter your registered email address to reset password</p>
      <Field>
        <FieldLabel htmlFor="email">
          <h3>Email Address</h3>
        </FieldLabel>
        <Input id="email" />
      </Field>
      <Button className="w-full">Reset Password</Button>
      <Button variant={'link'}>
        <Link to="/login">Back to Login Page</Link>
      </Button>
    </div>
  )
}
