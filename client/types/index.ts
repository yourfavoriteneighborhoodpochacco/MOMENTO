export type AccountType = "contributor" | "non-contributor" | "admin"
export type UserStatus = "pending" | "approved" | "suspended" | null
export type AvailabilityLabel =
  | "virtually empty"
  | "plenty of space"
  | "moderate"
  | "filling up"
  | "virtually full"

export interface Location {
  id: string
  name: string
  category: "study" | "gym" | "cafe"
  latitude: number
  longitude: number
  capacity_estimate: number
  parent_id: string | null
  admin_tag: string | null
}

export interface AvailabilityScore {
  id: string
  location_id: string
  score: number
  label: AvailabilityLabel
  computed_at: string
}

export interface CrowdReport {
  id: string
  location_id: string
  submitted_by: string
  seated_count: number
  line_count: number
  created_at: string
}

export interface CrowdReportCreate {
  location_id: string
  seated_count: number
  line_count: number
}

export interface User {
  id: string
  first_name: string
  username: string
  email: string
  phone_number: string | null
  profile_photo_url: string | null
  account_type: AccountType
  status: UserStatus
  location: string | null
  sms_notifications: boolean
  availability_alerts: boolean
  member_since: string
}

export interface UserCreate {
  first_name: string
  username: string
  email: string
  password: string
  phone_number?: string
  profile_photo_url?: string
  location?: string
  sms_notifications: boolean
  availability_alerts: boolean
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface SavedLocation {
  user_id: string
  location_id: string
  saved_at: string
}

export interface WebSocketScoreUpdate {
  location_id: string
  score: number
  label: AvailabilityLabel
}