import { sendResetPasswordEmail } from '@/auth/operations'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

type ForgotPasswordFormData = {
  email: string
}

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>()

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      await sendResetPasswordEmail(data.email)
      navigate({ to: '/reset-password-email' })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-3/4 m-auto flex flex-col items-center gap-8 "
    >
      <h1>Forgot Password</h1>
      <p>Enter your registered email address to reset password</p>
      <Field>
        <FieldLabel htmlFor="email">
          <h3>Email Address</h3>
        </FieldLabel>
        <Input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <ErrorAlert message={errors.email.message} />}
      </Field>
      {error && <ErrorAlert message={error} />}
      <Button className="w-full">Reset Password</Button>
      <Button variant={'link'}>
        <Link to="/login">Back to Login Page</Link>
      </Button>
    </form>
  )
}
