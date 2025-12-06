import logo from '@/assets/cfl-logo.png'
import { resetPassword } from '@/auth/operations'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { MaskableInput } from '@/components/ui_custom/MaskableInput'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>()

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data) => {
    try {
      await resetPassword(data.password)
      navigate({
        to: '/reset-password-success',
      })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const passwordValue = watch('password')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-10 flex flex-col justify-center items-center"
    >
      <img src={logo} alt="CFL Logo" />
      <h1>Reset Password</h1>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="new-password">
            <h3>New password</h3>
          </FieldLabel>
          <MaskableInput
            id="new-password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <ErrorAlert message={errors.password.message} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">
            <h3>Re-enter password</h3>
          </FieldLabel>
          <MaskableInput
            id="confirm-password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === passwordValue || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <ErrorAlert message={errors.confirmPassword.message} />
          )}
        </Field>
        {error && <ErrorAlert message={error} />}
        <Button>Reset</Button>
      </FieldGroup>
    </form>
  )
}
