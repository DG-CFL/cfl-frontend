import { AlertCircleIcon } from 'lucide-react'
import { Alert, AlertTitle } from '../ui/alert'

type ErrorAlertProps = {
  message?: string
}

export function ErrorAlert({ message }: ErrorAlertProps) {

  if (message && message.includes('email-already-in-use')) {
    message = "This user already exists";
  }
  return (
    <Alert variant={'destructive'} className='text-left'>
      <AlertCircleIcon />
      <AlertTitle>{message || "Oops, something went wrong"}</AlertTitle>
    </Alert>
  )
}
