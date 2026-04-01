import { type FC, useMemo } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer'
import type { TrainingOverviewDataPoint } from '@/types/analytics'

type Metrics = {
  totalTrainingSessions: number
  peopleTrained: number
  newlyCertifiedMembers: number
  certifiedMembers: number
  averageAttendance: number
  volunteerEngagement: number
}

type CertificationsData = {
  totalMembers: number
  certifiedMembers: number
}

type Props = {
  metrics: Metrics
  trainingOverview: TrainingOverviewDataPoint[]
  certifications: CertificationsData
  reportTitle: string
  periodLine: string
  generatedLabel: string
  watermark?: boolean
}

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  header: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  period: { fontSize: 10, textAlign: 'center', marginBottom: 10 },
  watermark: {
    position: 'absolute',
    fontSize: 60,
    color: '#CCCCCC',
    opacity: 0.2,
    top: '35%',
    left: '15%',
    transform: 'rotate(-30deg)',
  },
  section: { marginBottom: 20 },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chartImage: { width: '100%', height: 200, marginVertical: 10 },
})

// Helper: generate training overview SVG as PNG data URL
function generateTrainingOverviewImage(data: TrainingOverviewDataPoint[]) {
  if (!data.length) return ''
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 300
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#60A5FA'
  ctx.lineWidth = 2

  const maxPeople = Math.max(...data.map((d) => d.people), 1)
  const xStep = canvas.width / (data.length - 1 || 1)

  ctx.beginPath()
  data.forEach((p, i) => {
    const x = i * xStep
    const y = canvas.height - (p.people / maxPeople) * canvas.height
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()
  return canvas.toDataURL('image/png')
}

// Helper: generate certifications chart PNG
function generateCertificationsImage(cert: CertificationsData) {
  const { totalMembers, certifiedMembers } = cert
  const radius = 80
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const center = 100

  // background
  ctx.beginPath()
  ctx.arc(center, center, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = '#D1FAE5'
  ctx.lineWidth = 20
  ctx.stroke()

  // certified
  const percent = totalMembers ? certifiedMembers / totalMembers : 0
  ctx.beginPath()
  ctx.arc(
    center,
    center,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + 2 * Math.PI * percent,
  )
  ctx.strokeStyle = '#059669'
  ctx.lineWidth = 20
  ctx.stroke()

  return canvas.toDataURL('image/png')
}

export const AnalyticsReportPdf: FC<Props> = ({
  metrics,
  trainingOverview,
  certifications,
  reportTitle,
  periodLine,
  generatedLabel,
  watermark,
}) => {
  const trainingImg = useMemo(
    () => generateTrainingOverviewImage(trainingOverview),
    [trainingOverview],
  )
  const certificationsImg = useMemo(
    () => generateCertificationsImage(certifications),
    [certifications],
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {watermark && <Text style={styles.watermark}>Draft</Text>}
        <View style={styles.header}>
          <Text style={styles.title}>{reportTitle}</Text>
          <Text style={styles.period}>
            {periodLine} • Generated on {generatedLabel}
          </Text>
        </View>

        <View style={styles.section}>
          {Object.entries(metrics).map(([key, value]) => (
            <View key={key} style={styles.metricsRow}>
              <Text>{formatMetric(key)}</Text>
              <Text>{value.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text>Training Overview</Text>
          {trainingImg && <Image src={trainingImg} style={styles.chartImage} />}
        </View>

        <View style={styles.section}>
          <Text>Certifications</Text>
          {certificationsImg && (
            <Image src={certificationsImg} style={styles.chartImage} />
          )}
        </View>
      </Page>
    </Document>
  )
}

function formatMetric(key: string) {
  const map: Record<string, string> = {
    totalTrainingSessions: 'Total Training Sessions',
    peopleTrained: 'People Trained',
    newlyCertifiedMembers: 'Newly Certified Members',
    certifiedMembers: 'Certified Members',
    averageAttendance: 'Average Attendance',
    volunteerEngagement: 'Volunteer Engagement',
  }
  return map[key] ?? key.replace(/([A-Z])/g, ' $1')
}

function formatNumber(value: number) {
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 })
}
