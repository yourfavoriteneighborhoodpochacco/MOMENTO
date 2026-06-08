"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"

interface Application {
  id: string
  username: string
  email: string
  status: string
  note: string | null
}

async function getPendingApplications(token: string): Promise<Application[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/pending`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("Failed to fetch applications")
  return res.json()
}

async function approveApplication(userId: string, token: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${userId}/approve`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("Failed to approve application")
}

async function suspendUser(userId: string, token: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications/${userId}/suspend`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error("Failed to suspend user")
}

export default function AdminPage() {
  const { user, token, loading } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [fetching, setFetching] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
    if (!loading && user?.account_type !== "admin") router.push("/map")
  }, [user, loading, router])

  useEffect(() => {
    if (!token || !user || user.account_type !== "admin") return
    getPendingApplications(token)
      .then(setApplications)
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [token, user])

  async function handleApprove(userId: string) {
    if (!token) return
    setActionLoading(userId)
    try {
      await approveApplication(userId, token)
      setApplications(prev => prev.filter(a => a.id !== userId))
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(null)
    }
  }

  async function handleSuspend(userId: string) {
    if (!token) return
    setActionLoading(userId)
    try {
      await suspendUser(userId, token)
      setApplications(prev => prev.filter(a => a.id !== userId))
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading || fetching) return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAFAF8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-cormorant), Georgia, serif"
    }}>
      <p style={{ color: "#B0A898" }}>Loading...</p>
    </div>
  )

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#FAFAF8",
      fontFamily: "var(--font-cormorant), Georgia, serif",
      padding: "48px 40px"
    }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <Link href="/map" style={{ textDecoration: "none" }}>
          <p style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#9C9086",
            marginBottom: 32
          }}>
            ← Back to map
          </p>
        </Link>

        <h1 style={{
          fontSize: 28,
          fontWeight: 500,
          color: "#262626",
          letterSpacing: "0.04em",
          marginBottom: 8
        }}>
          Admin
        </h1>
        <p style={{
          fontSize: 13,
          color: "#9C9086",
          marginBottom: 40
        }}>
          Pending contributor applications
        </p>

        {applications.length === 0 ? (
          <div style={{
            backgroundColor: "#FAFAF8",
            borderRadius: 16,
            padding: "32px 24px",
            textAlign: "center",
            boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
          }}>
            <p style={{ fontSize: 15, color: "#B0A898" }}>
              No pending applications
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {applications.map(app => (
              <div
                key={app.id}
                style={{
                  backgroundColor: "#FAFAF8",
                  borderRadius: 16,
                  padding: "20px 24px",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 20
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "#262626",
                    marginBottom: 4
                  }}>
                    @{app.username}
                  </p>
                  <p style={{
                    fontSize: 13,
                    color: "#9C9086",
                    marginBottom: app.note ? 10 : 0
                  }}>
                    {app.email}
                  </p>
                  {app.note && (
                    <p style={{
                      fontSize: 13,
                      color: "#7A7570",
                      fontStyle: "italic",
                      lineHeight: 1.5
                    }}>
                      "{app.note}"
                    </p>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleApprove(app.id)}
                    disabled={actionLoading === app.id}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "none",
                      backgroundColor: actionLoading === app.id ? "#C8C4BA" : "#7A5F55",
                      color: "#ECF0F1",
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                      fontFamily: "inherit"
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleSuspend(app.id)}
                    disabled={actionLoading === app.id}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 8,
                      border: "1px solid #E0DDD6",
                      backgroundColor: "transparent",
                      color: "#C0786A",
                      fontSize: 12,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      cursor: actionLoading === app.id ? "not-allowed" : "pointer",
                      fontFamily: "inherit"
                    }}
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}