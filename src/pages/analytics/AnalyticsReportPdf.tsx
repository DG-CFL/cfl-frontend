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

function generateTrainingOverviewImage(data: TrainingOverviewDataPoint[]) {
  if (!data.length) return ''
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 300
  const ctx = canvas.getContext('2d')!
  const padding = 40

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Axes
  ctx.strokeStyle = '#ccc'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, canvas.height - padding)
  ctx.lineTo(canvas.width - padding, canvas.height - padding)
  ctx.stroke()

  const maxPeople = Math.max(...data.map((d) => d.people), 1)
  const xStep = (canvas.width - 2 * padding) / (data.length - 1)

  // Draw grid lines and Y labels
  ctx.fillStyle = '#000'
  ctx.font = '10px Helvetica'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  const gridSteps = 5
  for (let i = 0; i <= gridSteps; i++) {
    const y = padding + ((canvas.height - 2 * padding) * i) / gridSteps
    const value = Math.round(maxPeople * (1 - i / gridSteps))
    ctx.strokeStyle = '#eee'
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(canvas.width - padding, y)
    ctx.stroke()
    ctx.fillText(value.toString(), padding - 5, y)
  }

  // Line
  ctx.strokeStyle = '#60A5FA'
  ctx.lineWidth = 2
  ctx.beginPath()
  data.forEach((p, i) => {
    const x = padding + i * xStep
    const y =
      padding + (canvas.height - 2 * padding) * (1 - p.people / maxPeople)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.stroke()

  // Data points
  ctx.fillStyle = '#2563EB'
  data.forEach((p, i) => {
    const x = padding + i * xStep
    const y =
      padding + (canvas.height - 2 * padding) * (1 - p.people / maxPeople)
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, 2 * Math.PI)
    ctx.fill()
  })

  // X-axis labels
  // ctx.fillStyle = '#000'
  // ctx.textAlign = 'center'
  // ctx.textBaseline = 'top'
  // data.forEach((p, i) => {
  //   const x = padding + i * xStep
  //   ctx.fillText(p., x, canvas.height - padding + 5)
  // })

  return canvas.toDataURL('image/png')
}

function generateCertificationsImage(cert: CertificationsData) {
  const { totalMembers, certifiedMembers } = cert
  const radius = 80
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const center = 100

  const percent = totalMembers ? certifiedMembers / totalMembers : 0

  // Certified slice
  ctx.beginPath()
  ctx.moveTo(center, center)
  ctx.arc(
    center,
    center,
    radius,
    -Math.PI / 2,
    -Math.PI / 2 + 2 * Math.PI * percent,
  )
  ctx.closePath()
  ctx.fillStyle = '#10B981'
  ctx.fill()

  // Uncertified slice
  ctx.beginPath()
  ctx.moveTo(center, center)
  ctx.arc(
    center,
    center,
    radius,
    -Math.PI / 2 + 2 * Math.PI * percent,
    -Math.PI / 2 + 2 * Math.PI,
  )
  ctx.closePath()
  ctx.fillStyle = '#D1FAE5'
  ctx.fill()

  // Text label
  ctx.fillStyle = '#000'
  ctx.font = '14px Helvetica'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(
    `${certifiedMembers} / ${totalMembers} Certified`,
    center,
    center,
  )

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
  const certifiedPercent =
    certifications.certifiedMembers > 0
      ? Math.round(
          (certifications.certifiedMembers / certifications.totalMembers) * 100,
        )
      : 0

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
          <Text>Certified %: {certifiedPercent}% of members certified</Text>
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
