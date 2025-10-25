import logo from '@/assets/cfl-logo.png'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select'
import { CalendarDays, EyeClosed } from 'lucide-react'

export default function SignUp() {
  return (
    <div className="w-full max-w-6xl space-y-6 flex flex-col justify-center items-center text-center">
      <img src={logo} alt="CFL Logo" />
      <h1>Sign Up</h1>
      <FieldGroup className="grid sm:grid-cols-2 gap-x-40">
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
          <Select>
            <SelectTrigger id="gender">
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
      </FieldGroup>
      <div className="w-full gap-x-40 mt-10 grid grid-cols-2">
        <Button variant={"link"}>Back to Login</Button>
        <Button>Sign Up</Button>
      </div>
    </div>
  )
}
