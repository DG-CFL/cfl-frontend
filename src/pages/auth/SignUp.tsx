import { serializeDateWithoutTime } from '@/api/utils/utils'
import logo from '@/assets/cfl-logo.png'
import { signUp } from '@/auth/operations'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/ui_custom/DatePicker'
import { ErrorAlert } from '@/components/ui_custom/ErrorAlert'
import { MaskableInput } from '@/components/ui_custom/MaskableInput'
import type { SignUpFormData } from '@/types/auth'
import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'

export default function SignUp() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>()

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    
    try {
      await signUp(data)
      navigate({ to: '/sign-up-success' })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-6xl space-y-10 flex flex-col justify-center items-center text-center"
    >
      <img src={logo} alt="CFL Logo" />
      <h1>Sign Up</h1>
      <FieldGroup className="grid sm:grid-cols-2 gap-x-40">
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
        <Field>
          <FieldLabel htmlFor="full-name">
            <h3>Full Name</h3>
          </FieldLabel>
          <Input
            id="full-name"
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && <ErrorAlert message={errors.fullName.message} />}
        </Field>
        <Field>
          <FieldLabel htmlFor="gender">
            <h3>Gender</h3>
          </FieldLabel>
          <Select>
            <SelectTrigger id="gender" {...register('gender')}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="date-of-birth">
            <h3>Date of Birth</h3>
          </FieldLabel>

          <Controller
            {...register('dateOfBirth')}
            control={control}
            render={({ field }) => (
              <DatePicker
                id="date-of-birth"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM / DD / YYYY"
              />
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-number">
            <h3>Contact Number</h3>
          </FieldLabel>
          <Input id="contact-number" {...register('contactNumber')} />
        </Field>
      </FieldGroup>
      <div className="flex flex-col w-full gap-6">
        <div className="flex items-center gap-3">
          <Checkbox id="email-opt-in" {...register('marketingEmailPref')} />
          <Label
            htmlFor="email-opt-in"
            className="text-lg text-muted-foreground"
          >
            I want to receive email notifications from Caring for Life
          </Label>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="terms" {...register('acknowledgedTermsOfUse')} />
          <Label htmlFor="terms" className="text-lg text-muted-foreground">
            I acknowledge that I agree to the Terms of Use and have read the
            Privacy Policy
          </Label>
        </div>
      </div>

      <div className="">{error && <ErrorAlert message={error} />}</div>

      <div className="w-full gap-x-40 grid grid-cols-2">
        <Button variant={'link'}>
          <Link to="/login">Back to Login Page</Link>
        </Button>
        <Button>Sign Up</Button>
      </div>
    </form>
  )
}
