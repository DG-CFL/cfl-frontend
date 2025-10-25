import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MaskableInput } from '@/components/ui_custom/MaskableInput'
import { Link } from '@tanstack/react-router'

export default function Login() {
  return (
    <div className="w-3/4 m-auto flex flex-col items-center gap-8 ">
      <h1>Login</h1>
      <Field>
        <FieldLabel htmlFor="email">
          <h3>Email</h3>
        </FieldLabel>
        <Input id="email" />
      </Field>
      <Field>
        <FieldLabel htmlFor="password">
          <h3>Password</h3>
        </FieldLabel>
        <MaskableInput id="password" />
      </Field>
      <div className="w-full flex justify-between">
        <div className="flex items-center gap-3">
          <Checkbox id="remember-me" />
          <Label
            htmlFor="remember-me"
            className="text-muted-foreground text-lg"
          >
            Remember me
          </Label>
        </div>
        <Link to="/forgot-password">Forgot Password</Link>
      </div>
      <Button className='w-full'>Login</Button>
      <div className="w-full flex justify-between">
        <span className="text-muted-foreground text-lg">Don't have an account?</span>
        <Link to="/sign-up">Sign up now</Link>
      </div>
    </div>
  )
}
