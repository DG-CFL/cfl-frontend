import logo from '@/assets/cfl-logo.png'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { MaskableInput } from '@/components/ui_custom/MaskableInput'
import { useNavigate } from '@tanstack/react-router'

export default function ResetPassword() {
  const navigate = useNavigate()

  const handleResetPassword = () => {
    navigate({
      to: '/reset-password-success',
    })
  }

  return (
    <div className="space-y-10 flex flex-col justify-center items-center">
      <img src={logo} alt="CFL Logo" />
      <h1>Reset Password</h1>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="new-password">
            <h3>New password</h3>
          </FieldLabel>
          <MaskableInput id="new-password" />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">
            <h3>Re-enter password</h3>
          </FieldLabel>
          <MaskableInput id="confirm-password" />
        </Field>
        <Button onClick={handleResetPassword}>Reset</Button>
      </FieldGroup>
    </div>
  )
}
