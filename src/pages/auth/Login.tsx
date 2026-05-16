import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { signIn } from '@/auth/operations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { MaskableInput } from '@/components/ui_custom/MaskableInput'

type LoginFormData = {
  email: string
  password: string
  rememberMe: boolean
  acknowledgedTermsOfUse: boolean // Must be true for form to be submitted
}

export default function Login() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>()

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      await signIn(
        data.email,
        data.password,
        data.rememberMe,
        data.acknowledgedTermsOfUse,
      )
      navigate({ to: '/' })
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
      <h1>Login</h1>
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
      <Field>
        <FieldLabel htmlFor="password">
          <h3>Password</h3>
        </FieldLabel>
        <MaskableInput
          id="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <ErrorAlert message={errors.password.message} />}
      </Field>
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-3">
          <Checkbox id="remember-me" {...register('rememberMe')} />
          <Label
            htmlFor="remember-me"
            className="text-muted-foreground text-lg"
          >
            Remember me
          </Label>
        </div>
        <Link to="/forgot-password" className="link">
          Forgot Password
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-3">
          <Controller
            name="acknowledgedTermsOfUse"
            control={control}
            rules={{
              validate: (v) =>
                v === true ||
                'You must agree to the Terms of Use and Privacy Policy',
            }}
            render={({ field }) => (
              <Checkbox
                id="terms"
                className="mt-0.5"
                checked={!!field.value}
                onCheckedChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
              />
            )}
          />
          <Label
            htmlFor="terms"
            className="text-base font-normal leading-snug text-foreground"
          >
            I acknowledge that I agree to the{' '}
            <a
              href="#"
              className="text-sky-600 underline underline-offset-2 hover:text-sky-700"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Use
            </a>{' '}
            and have read the{' '}
            <a
              href="#"
              className="text-sky-600 underline underline-offset-2 hover:text-sky-700"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
          </Label>
        </div>
        {errors.acknowledgedTermsOfUse && (
          <ErrorAlert message={errors.acknowledgedTermsOfUse.message} />
        )}
      </div>

      {error && <ErrorAlert message={error} />}

      <Button className="w-full">Login</Button>
      <div className="w-full flex justify-between">
        <span className="text-muted-foreground text-lg">
          Don't have an account?
        </span>
        <Link to="/sign-up" className="link">
          Sign up now
        </Link>
      </div>
    </form>
  )
}
