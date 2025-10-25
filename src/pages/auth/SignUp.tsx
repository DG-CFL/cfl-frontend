import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { CalendarDays, EyeClosed } from 'lucide-react'

export default function SignUp() {
  return (
    <div className="w-full max-w-7xl space-y-6 text-center">
      <h1>Sign Up</h1>
      <FieldGroup className='grid sm:grid-cols-2 gap-x-40'>
        <Field>
          <FieldLabel htmlFor="email">
            <h3>Email Address</h3>
          </FieldLabel>
          <Input id="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">
            <h3>Password</h3>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="password" autoComplete="off" />
            <InputGroupAddon align={'inline-end'}>
              <InputGroupButton size={'icon-sm'}>
                <EyeClosed />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="full-name">
            <h3>Full Name</h3>
          </FieldLabel>
          <Input id="full-name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="gender">
            <h3>Gender</h3>
          </FieldLabel>
          <Input id="gender" />
        </Field>
        <Field>
          <FieldLabel htmlFor="date-of-birth">
            <h3>Date of Birth</h3>
          </FieldLabel>
          <InputGroup>
            <InputGroupInput id="date-of-birth" placeholder="MM / DD / YYYY" />
            <InputGroupAddon align={'inline-end'}>
              <InputGroupButton size={'icon-sm'}>
                <CalendarDays />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="contact-number">
            <h3>Contact Number</h3>
          </FieldLabel>
          <Input id="contact-number" />
        </Field>
        <Field className="mt-10">
          <Button>Sign Up</Button>
          <Button variant={'link'}>Back to Login</Button>
        </Field>
      </FieldGroup>
    </div>
  )
}
