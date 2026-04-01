import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnalyticsReportPdf } from './AnalyticsReportPdf'
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { useGetAnalyticsSummary } from '@/operations/analytics'
import { getAnalyticsDateRange } from '@/utils/analyticsDateRange'

export default function AnalyticsPdfPreviewPage() {
  const [watermark] = useState(false) // static since no UI
  const reportTitle = 'Analytics'

  const range = getAnalyticsDateRange('this-year')
  const periodLine = `${format(range.begin, 'd MMMM yyyy')} - ${format(range.end, 'd MMMM yyyy')}`
  const { data, isLoading, isError } = useGetAnalyticsSummary(range)

  const generatedLabel = format(new Date(), 'd MMMM yyyy')
  const fileName = `CFL_Impact_Report_${format(new Date(), 'yyyy-MM')}.pdf`

  if (isLoading) return <p>Loading...</p>
  if (isError || !data) return <p>Error loading analytics data.</p>

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
          <Button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-[#6B7C3F] px-4 text-sm font-normal text-white shadow-none hover:bg-[#5a6a35]"
          >
            <Mail className="h-4 w-4" />
            Email PDF
          </Button>

          <PDFDownloadLink
            document={
              <AnalyticsReportPdf
                metrics={{
                  totalTrainingSessions: data.totalTrainingSessions,
                  peopleTrained: data.intPeopleTrained,
                  newlyCertifiedMembers: data.newlyCertifiedMembers,
                  certifiedMembers: data.certifiedMembers,
                  averageAttendance: data.averageAttendance,
                  volunteerEngagement: data.volunteerEngagement,
                }}
                trainingOverview={data.trainingOverview}
                certifications={{
                  totalMembers: data.totalMembers,
                  certifiedMembers: data.certifiedMembers,
                }}
                reportTitle={reportTitle}
                periodLine={periodLine}
                generatedLabel={generatedLabel}
                watermark={watermark}
              />
            }
            fileName={fileName}
          >
            {({ loading }) => (
              <Button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-[#6B7C3F] px-4 text-sm font-normal text-white shadow-none hover:bg-[#5a6a35]"
              >
                <Download className="h-4 w-4" />
                {loading ? 'Generating...' : 'Export PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <PDFViewer style={{ width: '100%', height: '800px' }}>
          <AnalyticsReportPdf
            metrics={{
              totalTrainingSessions: data.totalTrainingSessions,
              peopleTrained: data.intPeopleTrained,
              newlyCertifiedMembers: data.newlyCertifiedMembers,
              certifiedMembers: data.certifiedMembers,
              averageAttendance: data.averageAttendance,
              volunteerEngagement: data.volunteerEngagement,
            }}
            trainingOverview={data.trainingOverview}
            certifications={{
              totalMembers: data.totalMembers,
              certifiedMembers: data.certifiedMembers,
            }}
            reportTitle={reportTitle}
            periodLine={periodLine}
            generatedLabel={generatedLabel}
            watermark={watermark}
          />
        </PDFViewer>
      </div>
    </div>
  )
}
