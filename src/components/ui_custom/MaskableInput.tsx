'use client'

import { EyeClosed, EyeIcon } from 'lucide-react'
import * as React from 'react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '../ui/input-group'

interface MaskableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
}

export function MaskableInput({ id, className, ...props }: MaskableInputProps) {
  const [show, setShow] = React.useState(false)

  return (
    <InputGroup>
      <InputGroupInput id={id} type={show ? 'text' : 'password'} {...props} />
      <InputGroupAddon align={'inline-end'}>
        <InputGroupButton size={"icon-sm"} onClick={() => setShow(!show)}>
          {show ? <EyeClosed /> : <EyeIcon />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
