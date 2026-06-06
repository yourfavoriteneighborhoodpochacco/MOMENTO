const API_URL = process.env.NEXT_PUBLIC_API_URL
import type {
  Location,
  AvailabilityScore,
  CrowdReport,
  CrowdReportCreate,
  User,
  UserCreate
} from "@/types"

// Auth

export async function login(
  email: string,
  password: string
): Promise<{ access_token: string; token_type: string }> {
  const form = new URLSearchParams()
  form.append("username", email)
  form.append("password", password)

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  })

  if (!res.ok) throw new Error("Invalid email or password")
  return res.json()
}

export async function getMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("Failed to fetch user")
  return res.json()
}

// Locations

export async function getLocations(): Promise<Location[]> {
  const res = await fetch(`${API_URL}/locations/`)
  if (!res.ok) throw new Error("Failed to fetch locations")
  return res.json()
}

export async function getLocation(id: string): Promise<Location> {
  const res = await fetch(`${API_URL}/locations/${id}`)
  if (!res.ok) throw new Error("Failed to fetch location")
  return res.json()
}

export async function getSublocations(id: string): Promise<Location[]> {
  const res = await fetch(`${API_URL}/locations/${id}/sublocations`)
  if (!res.ok) throw new Error("Failed to fetch sublocations")
  return res.json()
}

// Availability

export async function getAvailability(
  locationId: string
): Promise<AvailabilityScore> {
  const res = await fetch(`${API_URL}/locations/${locationId}/availability`)
  if (!res.ok) throw new Error("Failed to fetch availability")
  return res.json()
}

// Crowd Reports

export async function submitCrowdReport(
  data: CrowdReportCreate,
  token: string
): Promise<CrowdReport> {
  const res = await fetch(`${API_URL}/crowd-reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Failed to submit crowd report")
  return res.json()
}

// Users

export async function registerUser(data: UserCreate): Promise<User> {
  const res = await fetch(`${API_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || "Failed to register")
  }
  return res.json()
}

// Applications

export async function submitApplication(
  note: string,
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/applications/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ note })
  })
  if (!res.ok) throw new Error("Failed to submit application")
}