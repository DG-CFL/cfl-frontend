import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Controller,  useForm } from 'react-hook-form'
import type { SignUpFormData } from '@/types/auth'
import type {SubmitHandler} from 'react-hook-form';
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
import { cn } from '@/lib/utils'

const AUTH_INPUT =
  'h-14 rounded-md border-0 bg-[#EAEAEA] shadow-none text-base text-foreground placeholder:text-neutral-600 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#6B7E45]/35'
const AUTH_SELECT =
  'h-14 w-full rounded-md border-0 bg-[#EAEAEA] shadow-none text-base data-[placeholder]:text-neutral-600 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#6B7E45]/35'
const AUTH_SELECT_COUNTRY =
  'h-14 w-[7.75rem] shrink-0 rounded-md border-0 bg-[#EAEAEA] shadow-none text-base focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#6B7E45]/35'
const AUTH_BTN =
  'h-14 w-full rounded-md border-0 bg-[#6B7E45] text-base font-medium text-white shadow-none hover:bg-[#5d6d3b] focus-visible:ring-2 focus-visible:ring-[#6B7E45]/50'

type SignUpFormValues = Omit<SignUpFormData, 'contactNumber' | 'dateOfBirth'> & {
  countryDialCode: string
  phoneLocal: string
  dateOfBirth?: Date
}

const DIAL_OPTIONS = [{ value: '+65', label: '🇸🇬 +65' }] as const

export default function SignUp() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      gender: '',
      countryDialCode: '+65',
      phoneLocal: '',
      marketingEmailPref: false,
      acknowledgedTermsOfUse: false,
    },
  })

  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    const payload: SignUpFormData = {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth!,
      contactNumber: `${data.countryDialCode}${data.phoneLocal.replace(/\D/g, '')}`,
      marketingEmailPref: data.marketingEmailPref,
      acknowledgedTermsOfUse: data.acknowledgedTermsOfUse,
    }

    try {
      setError(null)
      await signUp(payload)
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
      className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-6 sm:px-6"
    >
      <h1 className="text-center text-3xl! font-bold! tracking-tight text-foreground sm:text-4xl!">
        Sign Up
      </h1>

      <FieldGroup className="grid w-full grid-cols-1 gap-x-14 gap-y-8 text-left lg:grid-cols-2">
        <Field className="gap-2">
          <FieldLabel htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </FieldLabel>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            className={cn(AUTH_INPUT)}
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <ErrorAlert message={errors.email.message} />}
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </FieldLabel>
          <MaskableInput
            id="password"
            autoComplete="new-password"
            inputGroupClassName={cn(
              'h-14 rounded-md border-0 bg-[#EAEAEA] shadow-none focus-within:ring-2 focus-within:ring-[#6B7E45]/35',
            )}
            className="placeholder:text-neutral-600"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <ErrorAlert message={errors.password.message} />}
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="full-name" className="text-sm font-medium text-foreground">
            Full Name (as on NRIC)
          </FieldLabel>
          <Input
            id="full-name"
            autoComplete="name"
            className={cn(AUTH_INPUT)}
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && <ErrorAlert message={errors.fullName.message} />}
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="gender" className="text-sm font-medium text-foreground">
            Gender
          </FieldLabel>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'Gender is required' }}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="gender" className={cn(AUTH_SELECT)}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && <ErrorAlert message={errors.gender.message} />}
        </Field>

        <Field className="gap-2">
          <FieldLabel htmlFor="date-of-birth" className="text-sm font-medium text-foreground">
            Date of Birth
          </FieldLabel>
          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              required: 'Date of birth is required',
            }}
            render={({ field }) => (
              <DatePicker
                id="date-of-birth"
                value={field.value}
                onChange={field.onChange}
                placeholder="MM / DD / YYYY"
                inputClassName={cn(AUTH_INPUT, 'h-14 pr-12')}
              />
            )}
          />
          {errors.dateOfBirth && (
            <ErrorAlert message={errors.dateOfBirth.message} />
          )}
        </Field>

        <Field className="gap-2">
          <FieldLabel className="text-sm font-medium text-foreground">
            Contact Number
          </FieldLabel>
          <div className="flex w-full gap-2">
            <Controller
              name="countryDialCode"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    aria-label="Country code"
                    className={cn(AUTH_SELECT_COUNTRY)}
                  >
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {DIAL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <Input
              id="contact-number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="Phone number"
              className={cn(AUTH_INPUT, 'min-w-0 flex-1')}
              {...register('phoneLocal', {
                required: 'Contact number is required',
                validate: (v) => {
                  const digits = v.replace(/\D/g, '')
                  return digits.length >= 6 || 'Enter a valid phone number'
                },
              })}
            />
          </div>
          {errors.phoneLocal && (
            <ErrorAlert message={errors.phoneLocal.message} />
          )}
        </Field>
      </FieldGroup>

      <div className="flex w-full flex-col gap-5 text-left">
        <div className="flex items-start gap-3">
          <Checkbox
            id="email-opt-in"
            className="mt-0.5"
            {...register('marketingEmailPref')}
          />
          <Label
            htmlFor="email-opt-in"
            className="text-base font-normal leading-snug text-foreground"
          >
            I want to receive email notifications from Caring for Life
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            className="mt-0.5"
            {...register('acknowledgedTermsOfUse', {
              validate: (v) =>
                v === true || 'You must agree to the Terms of Use and Privacy Policy',
            })}
          />
          <Label htmlFor="terms" className="text-base font-normal leading-snug text-foreground">
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
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
        <Button type="button" asChild className={cn(AUTH_BTN)}>
          <Link to="/login">Back to Login</Link>
        </Button>
        <Button type="submit" className={cn(AUTH_BTN)}>
          Sign Up
        </Button>
      </div>
    </form>
  )
}
