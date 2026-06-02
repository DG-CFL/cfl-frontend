import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useSendEmailToUser } from '@/operations/events'

/** Tweak colors / copy here when the design changes */
const theme = {
  tabActive: 'bg-[#5D7241] text-white',
  tabInactive: 'bg-[#A3BD83] text-white hover:bg-[#93ad73]',
  action:
    'h-11 rounded-md border-0 bg-[#5D7241] px-5 text-sm font-medium text-white shadow-none hover:bg-[#4a5e34] focus-visible:ring-2 focus-visible:ring-[#5D7241]/40',
  border: 'border border-neutral-300',
} as const

const EMAIL_TEMPLATES = [
  'Survey Request',
  'Refresher Course Invitation',
  'E-Certificate',
  'Event Feedback Request',
] as const

const EMAIL_TEMPLATE_BODY: Record<(typeof EMAIL_TEMPLATES)[number], string> = {
  'Survey Request': '',
  'Refresher Course Invitation': '',
  'E-Certificate': '',
  'Event Feedback Request': '',
}

export default function EmailPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/app/volunteers/email' })
  const sendEmailToUser = useSendEmailToUser()
  const recipientIds = (search.ids ?? '')
    .split(',')
    .map((id: string) => id.trim())
    .filter((id: string) => id.length > 0)

  const [templateIndex, setTemplateIndex] = useState(0)
  const [subject, setSubject] = useState<string>(EMAIL_TEMPLATES[0])
  const [body, setBody] = useState(EMAIL_TEMPLATE_BODY[EMAIL_TEMPLATES[0]])
  const [sendStatus, setSendStatus] = useState<string | null>(null)
  const [sendError, setSendError] = useState<string | null>(null)

  const selectedTemplate = EMAIL_TEMPLATES[templateIndex]

  const handleSelectTemplate = (index: number) => {
    const template = EMAIL_TEMPLATES[index]
    setTemplateIndex(index)
    setSubject(template)
    setBody(EMAIL_TEMPLATE_BODY[template])
    setSendStatus(null)
    setSendError(null)
  }

  const handleSend = async () => {
    setSendStatus(null)
    setSendError(null)

    if (recipientIds.length === 0) {
      setSendError('Select at least one volunteer before sending an email.')
      return
    }

    const trimmedSubject = subject.trim()
    const trimmedBody = body.trim()
    if (!trimmedSubject && !trimmedBody) {
      setSendError('Enter a subject or email content before sending.')
      return
    }

    const email = [
      `Subject: ${trimmedSubject || selectedTemplate}`,
      '',
      trimmedBody,
    ]
      .filter((part) => part.length > 0)
      .join('\n')

    try {
      for (const userId of recipientIds) {
        await sendEmailToUser.mutateAsync({ userId, email })
      }
      setSendStatus(`Email sent to ${recipientIds.length} recipient(s).`)
    } catch (error) {
      setSendError(
        error instanceof Error ? error.message : 'Failed to send email.',
      )
    }
  }

  return (
    <div className="w-full p-6 lg:p-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
        Email
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {EMAIL_TEMPLATES.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => handleSelectTemplate(i)}
              className={cn(
                'rounded-full px-4 py-2 text-left text-sm font-medium transition-colors',
                i === templateIndex ? theme.tabActive : theme.tabInactive,
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Add email type"
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-neutral-600 text-white transition-colors hover:bg-neutral-700"
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </button>
      </div>

      <div className={cn('overflow-hidden rounded-lg', theme.border)}>
        <section className="border-b border-neutral-300 px-6 py-4">
          <p className="text-sm font-semibold text-foreground">
            Recipients: {recipientIds.length}
          </p>
        </section>

        <section className="border-b border-neutral-300 px-6 py-4">
          <label
            htmlFor="email-subject"
            className="text-sm font-semibold text-foreground"
          >
            Subject:
          </label>
          <Input
            id="email-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="mt-2 h-11 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0"
          />
        </section>

        <section className="px-6 py-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[min(50vh,28rem)] w-full resize-y border-0 bg-transparent p-0 text-base leading-relaxed shadow-none focus-visible:ring-0"
            aria-label="Email body"
          />
        </section>
      </div>

      {sendStatus ? (
        <p className="mt-4 text-sm font-medium text-green-700">{sendStatus}</p>
      ) : null}
      {sendError ? (
        <p className="mt-4 text-sm font-medium text-red-600">{sendError}</p>
      ) : null}

      <footer className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          className={cn(theme.action, 'w-full sm:w-auto')}
          onClick={() => navigate({ to: '/volunteers' })}
        >
          Cancel
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
          <Button
            type="button"
            className={cn(theme.action, 'w-full sm:w-auto')}
          >
            Preview
          </Button>
          <Button
            type="button"
            className={cn(theme.action, 'w-full sm:w-auto')}
          >
            Save
          </Button>
          <div className="flex w-full overflow-hidden rounded-md sm:w-auto">
            <Button
              type="button"
              disabled={sendEmailToUser.isPending}
              onClick={handleSend}
              className={cn(
                theme.action,
                'flex-1 rounded-none sm:flex-initial',
              )}
            >
              {sendEmailToUser.isPending ? 'Sending...' : 'Send'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  aria-label="More send options"
                  className={cn(
                    theme.action,
                    'rounded-none border-l border-white/25 px-3',
                  )}
                >
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem>Schedule send</DropdownMenuItem>
                <DropdownMenuItem>Send test to me</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </footer>
    </div>
  )
}
