export type AnalyticsData = {
  totalTrainingSessions: number
  numberPeopleTrained: number
  totalMembers: number
  certifiedMembers: number
  newlyCertifiedMembers: number
  averageAttendance: number // percentage
  volunteerEngagement: number // percentage
  trainingOverview: TrainingOverviewDataPoint[] // over the last year
}

export type TrainingOverviewDataPoint = {
  people: number
  sessions: number
}
