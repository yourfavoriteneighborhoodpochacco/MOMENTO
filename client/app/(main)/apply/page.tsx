"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { submitApplication } from "@/lib/api"

export default function ApplyPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [note, setNote] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
    if (!loading && user?.account_type === "contributor") router.push("/profile")
    if (!loading && user?.status === "pending") setSuccess(true)
  }, [user, loading, router])

  async function handleSubmit() {
    if (!note.trim()) {
      setError("Please write a short note")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await submitApplication(note, localStorage.getItem("momento_token") || "")
      setSuccess(true)
    } catch (e: any) {
      setError(e.message || "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ECF0F1",
      fontFamily: "var(--font-cormorant), Georgia, serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px"
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <p style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#9C9086",
            marginBottom: 20
          }}>
            ← Back to profile
          </p>
        </Link>

        <div style={{
          backgroundColor: "#FAFAF8",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            height: 80,
            background: "linear-gradient(135deg, #DDD9D0 0%, #C8C4BA 50%, #D4D0C8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <h1 style={{
              fontSize: 24,
              fontWeight: 500,
              color: "#7A5F55",
              letterSpacing: "0.08em"
            }}>
              momento
            </h1>
          </div>

          <div style={{ padding: "32px 28px" }}>
            {success ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#262626",
                  marginBottom: 8
                }}>
                  Application submitted
                </p>
                <p style={{
                  fontSize: 13,
                  color: "#9C9086",
                  lineHeight: 1.6,
                  marginBottom: 24
                }}>
                  We'll review your application and notify you by SMS when a decision is made.
                </p>
                <Link href="/map" style={{ textDecoration: "none" }}>
                  <div style={{
                    backgroundColor: "#7A5F55",
                    borderRadius: 10,
                    padding: "11px 20px",
                    display: "inline-block"
                  }}>
                    <span style={{
                      fontSize: 12,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "#ECF0F1"
                    }}>
                      Back to map
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <p style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#B0A898",
                  marginBottom: 8
                }}>
                  Contributor application
                </p>
                <p style={{
                  fontSize: 14,
                  color: "#7A7570",
                  lineHeight: 1.6,
                  marginBottom: 24
                }}>
                  Tell us in one sentence why you'd like to contribute to momento.
                </p>

                <div style={{ marginBottom: 20 }}>
                  <label style={{
                    display: "block",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#9C9086",
                    marginBottom: 8
                  }}>
                    Your note
                  </label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    rows={3}
                    placeholder="I want to help students find quiet study spots on campus..."
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid #E0DDD6",
                      backgroundColor: "#F5F3EF",
                      fontSize: 14,
                      color: "#262626",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      lineHeight: 1.6
                    }}
                  />
                </div>

                {error && (
                  <p style={{
                    fontSize: 12,
                    color: "#F44336",
                    marginBottom: 16
                  }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 10,
                    border: "none",
                    backgroundColor: submitting ? "#C8C4BA" : "#7A5F55",
                    color: "#ECF0F1",
                    fontSize: 13,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "inherit"
                  }}
                >
                  {submitting ? "Submitting..." : "Submit application"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}