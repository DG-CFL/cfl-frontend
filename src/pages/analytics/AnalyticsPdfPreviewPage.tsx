import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AnalyticsReportContent } from '@/pages/analytics/AnalyticsReportContent'
import { cn } from '@/lib/utils'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const SAGE_PANEL = '#D4E4C4'
const SAGE_MODAL = '#C8DDB0'

const REPORT_FILE_BASE = 'CFL_Impact_Report'

const REPORT_LANG_CODES: Record<string, string> = {
  english: 'en',
  malay: 'ms',
  chinese: 'zh',
  tamil: 'ta',
}

function CflLogoMark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        className="shrink-0 text-[#5B6D44]"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M20 4c-4 8-12 14-12 22a12 12 0 1024 0c0-8-8-14-12-22z"
          opacity="0.35"
        />
        <path
          fill="currentColor"
          d="M22 6c-2 10-6 16-6 22a8 8 0 1012-14c-2-4-4-6-6-8z"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-xs font-semibold tracking-tight text-[#3d4a2e]">
          Caring for Life
        </div>
      </div>
    </div>
  )
}

function WatermarkSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          enabled ? 'bg-[#6B7C3F]' : 'bg-gray-400',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform',
            enabled && 'translate-x-5',
          )}
        />
      </button>
      <span className="text-sm text-gray-700">Toggle watermark</span>
    </div>
  )
}

function DateField({
  label,
  date,
  onSelect,
  placeholder,
}: {
  label: string
  date: Date | undefined
  onSelect: (d: Date | undefined) => void
  placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const display = date ? format(date, 'EEEE dd/MM/yyyy') : placeholder

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-gray-600">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full justify-start rounded-lg border-gray-200 bg-white text-left text-sm font-normal text-gray-800 shadow-none"
          >
            <CalendarDays className="mr-2 h-4 w-4 text-[#6B7C3F]" />
            <span className={cn(!date && 'text-gray-400')}>{display}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onSelect(d)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function AnalyticsPdfPreviewPage() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [reportLanguage, setReportLanguage] = useState('english')
  const [watermark, setWatermark] = useState(false)
  const [reportTitle, setReportTitle] = useState('Analytics')
  const [periodLine, setPeriodLine] = useState(
    '1 November 2025 - 30 November 2025',
  )

  const [emailOpen, setEmailOpen] = useState(false)
  const [emailStep, setEmailStep] = useState<'form' | 'success'>('form')
  const [toEmails, setToEmails] = useState('')
  const [cc, setCc] = useState('')
  const [bcc, setBcc] = useState('')
  const [message, setMessage] = useState('')
  const [scheduleRecur, setScheduleRecur] = useState(true)
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly'>('monthly')
  const [fromDate, setFromDate] = useState<Date | undefined>(
    new Date(2025, 11, 15),
  )
  const [toDate, setToDate] = useState<Date | undefined>(new Date(2026, 11, 31))

  const [exportPdfOpen, setExportPdfOpen] = useState(false)

  const generatedLabel = format(new Date(), 'd MMMM yyyy')
  const fileSlug = format(new Date(), 'yyyy-MM')
  const langCode = REPORT_LANG_CODES[reportLanguage] ?? 'en'
  const fileName = `${REPORT_FILE_BASE}_${fileSlug}_${langCode}.pdf`

  useEffect(() => {
    if (!emailOpen) {
      setEmailStep('form')
    }
  }, [emailOpen])

  const handleDemoEmailSend = () => {
    setEmailStep('success')
  }

  const exportPdf = async () => {
    if (!reportRef.current) return

    const input = reportRef.current

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true, 
      allowTaint: true,
      scrollY: -window.scrollY,
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const pageHeight = 297

    const imgProps = pdf.getImageProperties(imgData)
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width

    let heightLeft = pdfHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      pdf.addPage()
      position = heightLeft - pdfHeight
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pdfHeight)
      heightLeft -= pageHeight
    }

    pdf.save(fileName)
  }

  return (
    <div className="min-h-screen w-full bg-[#F7F7F7] p-6">
      <Link
        to="/analytics"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PDF Preview</h1>
          <p className="mt-1 text-sm text-gray-500">{fileName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={reportLanguage} onValueChange={setReportLanguage}>
            <SelectTrigger className="h-9 w-[130px] shrink-0 rounded-lg border-gray-300 bg-white text-sm shadow-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="malay">Malay</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="tamil">Tamil</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-0 bg-[#6B7C3F] px-4 text-sm font-normal text-white shadow-none hover:bg-[#5a6a35]"
            onClick={() => setEmailOpen(true)}
          >
            <Mail className="h-4 w-4 shrink-0" />
            Email PDF
          </Button>
          <Button
            type="button"
            className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border-0 bg-[#6B7C3F] px-4 text-sm font-normal text-white shadow-none hover:bg-[#5a6a35]"
            onClick={() => setExportPdfOpen(true)}
          >
            <Download className="h-4 w-4 shrink-0" />
            Export
          </Button>
        </div>
      </div>

      <div
        className="relative rounded-2xl p-6 md:p-10"
        style={{ backgroundColor: SAGE_PANEL }}
      >
        <div className="mx-auto max-h-[calc(100vh-12rem)] max-w-6xl overflow-y-auto pr-1">
          <div
            ref={reportRef}
            data-report-root
            className="relative rounded-lg bg-white p-6 shadow-sm md:p-8"
          >
            {watermark && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg"
                aria-hidden
              >
                <span className="rotate-[-28deg] text-5xl font-bold tracking-[0.2em] text-gray-200/90 uppercase select-none">
                  Draft
                </span>
              </div>
            )}

            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <CflLogoMark />
              <div className="w-full max-w-md space-y-2 sm:text-right">
                <Label htmlFor="period-line" className="text-xs text-gray-500">
                  Report period
                </Label>
                <Input
                  id="period-line"
                  value={periodLine}
                  onChange={(e) => setPeriodLine(e.target.value)}
                  className="h-9 rounded-lg border-gray-200 bg-white text-sm shadow-none sm:text-right"
                />
              </div>
            </div>

            <div className="relative mx-auto mt-8 max-w-xl space-y-2 text-center">
              <Label htmlFor="report-title" className="text-xs text-gray-500">
                Report title
              </Label>
              <Input
                id="report-title"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="h-11 rounded-lg border-gray-200 bg-white text-center text-xl font-bold text-gray-900 shadow-none"
              />
              <p className="pt-1 text-sm text-gray-600">
                Generated on: {generatedLabel}
              </p>
              <p className="text-xs text-gray-500">
                Language:{' '}
                {{
                  english: 'English',
                  malay: 'Malay',
                  chinese: 'Chinese',
                  tamil: 'Tamil',
                }[reportLanguage] ?? reportLanguage}
              </p>
            </div>

            <div className="relative mt-10 border-t border-gray-100 pt-8">
              <AnalyticsReportContent />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <WatermarkSwitch enabled={watermark} onChange={setWatermark} />
      </div>

      <Dialog open={exportPdfOpen} onOpenChange={setExportPdfOpen}>
        <DialogContent
          showCloseButton
          className="max-w-md rounded-2xl border border-[#5B6D44]/20 p-6 shadow-lg"
          style={{ backgroundColor: SAGE_MODAL }}
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold text-gray-800">
              Export PDF
            </DialogTitle>
            <DialogDescription className="sr-only">
              Choose the export language for the report. PDF download from this
              dialog is not available yet.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {(
              [
                ['english', 'English'],
                ['malay', 'Malay'],
                ['chinese', 'Chinese'],
                ['tamil', 'Tamil'],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 text-sm text-gray-800"
              >
                <Checkbox
                  checked={reportLanguage === key}
                  onCheckedChange={(checked) => {
                    if (checked === true) setReportLanguage(key)
                  }}
                  className="border-gray-500 data-[state=checked]:border-[#6B7C3F] data-[state=checked]:bg-[#6B7C3F]"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              onClick={exportPdf}
              type="button"
              className="h-10 flex-1 rounded-xl border-0 bg-[#6B7C3F]/50 text-white shadow-none"
            >
              Export
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-xl border-[#6B7C3F] bg-white/60 text-gray-800 shadow-none hover:bg-white"
              onClick={() => setExportPdfOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[90vh] max-w-lg overflow-y-auto rounded-2xl border border-[#5B6D44]/20 p-6 shadow-lg"
          style={{ backgroundColor: SAGE_MODAL }}
        >
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold text-gray-800">
              Email PDF
            </DialogTitle>
            <DialogDescription className="sr-only">
              Compose an email to send the PDF report. Scheduling options are
              for display only until the backend is connected.
            </DialogDescription>
          </DialogHeader>

          {emailStep === 'success' ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#6B7C3F] text-white">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Email Successfully Sent
              </h3>
              <p className="text-sm text-gray-600">
                Not seeing your email? Try checking your spam.
              </p>
              <Link
                to="/"
                className="text-sm font-medium text-[#5B6D44] underline-offset-4 hover:underline"
              >
                Home
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email-to" className="text-xs text-gray-700">
                  To:
                </Label>
                <Input
                  id="email-to"
                  placeholder="email@example.com, other@example.com"
                  value={toEmails}
                  onChange={(e) => setToEmails(e.target.value)}
                  className="h-10 rounded-lg border-gray-200 bg-white text-sm shadow-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Cc:</Label>
                <Input
                  placeholder="Enter email here (optional)"
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="h-10 rounded-lg border-gray-200 bg-white text-sm shadow-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Bcc:</Label>
                <Input
                  placeholder="Enter email here (optional)"
                  value={bcc}
                  onChange={(e) => setBcc(e.target.value)}
                  className="h-10 rounded-lg border-gray-200 bg-white text-sm shadow-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-700">Your message</Label>
                <Textarea
                  placeholder="Type your message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] rounded-lg border-gray-200 bg-white text-sm shadow-none"
                />
                <p className="text-xs text-gray-500">
                  Your message will be sent as the body text to the provided
                  email.
                </p>
              </div>
              <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-blue-600">
                {fileName} <span className="text-gray-500">(120K)</span>
              </div>

              <label className="flex cursor-pointer items-start gap-2 pt-2">
                <Checkbox
                  checked={scheduleRecur}
                  onCheckedChange={(c) => setScheduleRecur(c === true)}
                  className="mt-0.5 border-gray-500 data-[state=checked]:border-[#6B7C3F] data-[state=checked]:bg-[#6B7C3F]"
                />
                <span className="text-sm text-gray-800">
                  Schedule this email to recur multiple times
                </span>
              </label>

              {scheduleRecur && (
                <div className="space-y-4 rounded-xl border border-white/50 bg-white/40 p-4">
                  <p className="text-sm font-medium text-gray-800">
                    How often would you like to schedule this email?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      className={cn(
                        'h-12 flex-1 rounded-xl border text-sm font-medium transition-colors',
                        frequency === 'monthly'
                          ? 'border-[#6B7C3F] bg-[#6B7C3F] text-white'
                          : 'border-gray-300 bg-white text-gray-700',
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('quarterly')}
                      className={cn(
                        'h-12 flex-1 rounded-xl border text-sm font-medium transition-colors',
                        frequency === 'quarterly'
                          ? 'border-[#6B7C3F] bg-[#6B7C3F] text-white'
                          : 'border-gray-300 bg-white text-gray-700',
                      )}
                    >
                      Quarterly
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <DateField
                      label="From"
                      date={fromDate}
                      onSelect={setFromDate}
                      placeholder="Select date"
                    />
                    <DateField
                      label="To"
                      date={toDate}
                      onSelect={setToDate}
                      placeholder="Select date"
                    />
                  </div>
                </div>
              )}

              <Button
                type="button"
                className="mt-2 h-11 w-full rounded-xl border-0 bg-[#6B7C3F] text-white shadow-none hover:bg-[#5a6a35]"
                onClick={handleDemoEmailSend}
              >
                Send
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
