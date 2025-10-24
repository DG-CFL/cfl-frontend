import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignUp() {
  return (
    <>
      <h1>Sign Up</h1>
      <FieldGroup className="w-[426px]">
        <Field>
          <FieldLabel htmlFor="username"><h2>Username</h2></FieldLabel>
          <Input id="username" autoComplete="off"/>
        </Field>
        <Field>
          <FieldLabel htmlFor="email"><h2>Email</h2></FieldLabel>
          <Input id="email" autoComplete="off"/>
        </Field>
        <Field>
          <FieldLabel htmlFor="password"><h2>Password</h2></FieldLabel>
          <Input id="password" autoComplete="off"/>
        </Field>
      </FieldGroup>
    </>
  )
}
