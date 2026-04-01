export type TrainingOverviewDataPoint = {
  people: number
  sessions: number
}

/** Response from GET /v1/admin/analytics (camelCase after API transform). */
export type AnalyticsData = {
  totalTrainingSessions: number
  /** API field name from backend summary report */
  intPeopleTrained: number
  totalMembers: number
  certifiedMembers: number
  newlyCertifiedMembers: number
  averageAttendance: number
  volunteerEngagement: number
  trainingOverview: Array<TrainingOverviewDataPoint>
}
