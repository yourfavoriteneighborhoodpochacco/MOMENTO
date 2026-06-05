"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { registerUser, login, getMe } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function RegisterPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  const [form, setForm] = useState({
    first_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    location: "",
    sms_notifications: false,
    availability_alerts: false
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleChange(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleRegister() {
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    try {
      await registerUser({
        first_name: form.first_name,
        username: form.username,
        email: form.email,
        password: form.password,
        phone_number: form.phone_number || undefined,
        location: form.location || undefined,
        sms_notifications: form.sms_notifications,
        availability_alerts: form.availability_alerts
      })

      const { access_token } = await login(form.email, form.password)
      const user = await getMe(access_token)
      signIn(access_token, user)
      router.push("/map")
    } catch (e: any) {
      setError(e.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #E0DDD6",
    backgroundColor: "#F5F3EF",
    fontSize: 14,
    color: "#262626",
    outline: "none",
    boxSizing: "border-box" as const,
    fontFamily: "inherit"
  }

  const labelStyle = {
    display: "block",
    fontSize: 11,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#9C9086",
    marginBottom: 6
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ECF0F1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-cormorant), Georgia, serif",
      padding: "40px 0"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#FAFAF8",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        overflow: "hidden"
      }}>

        {/* Banner */}
        <div style={{
          height: 80,
          background: "linear-gradient(135deg, #DDD9D0 0%, #C8C4BA 50%, #D4D0C8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <h1 style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#7A5F55",
            letterSpacing: "0.08em"
          }}>
            momento
          </h1>
        </div>

        {/* Form */}
        <div style={{ padding: "32px 28px" }}>
          <p style={{
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#B0A898",
            marginBottom: 24
          }}>
            Create your account
          </p>

          {/* First name */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>First name</label>
            <input
              type="text"
              value={form.first_name}
              onChange={e => handleChange("first_name", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={form.username}
              onChange={e => handleChange("username", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange("email", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e => handleChange("password", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => handleChange("confirmPassword", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Phone — optional */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Phone number{" "}
              <span style={{ color: "#C0B8B0", textTransform: "none", letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <input
              type="tel"
              value={form.phone_number}
              onChange={e => handleChange("phone_number", e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Location — optional */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>
              Your area{" "}
              <span style={{ color: "#C0B8B0", textTransform: "none", letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Irvine, CA"
              value={form.location}
              onChange={e => handleChange("location", e.target.value)}
              style={{ ...inputStyle, color: form.location ? "#262626" : "#B0A898" }}
            />
          </div>

          {/* Notification preferences */}
          <div style={{
            borderTop: "1px solid #ECEAE4",
            paddingTop: 20,
            marginBottom: 24
          }}>
            <p style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#B0A898",
              marginBottom: 14
            }}>
              Notifications
            </p>

            {/* SMS notifications */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12
            }}>
              <div>
                <p style={{ fontSize: 13, color: "#262626", marginBottom: 2 }}>
                  SMS notifications
                </p>
                <p style={{ fontSize: 11, color: "#B0A898" }}>
                  Application updates via text
                </p>
              </div>
              <div
                onClick={() => handleChange("sms_notifications", !form.sms_notifications)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: form.sms_notifications ? "#7A5F55" : "#D4D0C8",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  flexShrink: 0
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 3,
                  left: form.sms_notifications ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                }} />
              </div>
            </div>

            {/* Availability alerts */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <p style={{ fontSize: 13, color: "#262626", marginBottom: 2 }}>
                  Availability alerts
                </p>
                <p style={{ fontSize: 11, color: "#B0A898" }}>
                  Text me when a saved location clears up
                </p>
              </div>
              <div
                onClick={() => handleChange("availability_alerts", !form.availability_alerts)}
                style={{
                  width: 40,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: form.availability_alerts ? "#7A5F55" : "#D4D0C8",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  flexShrink: 0
                }}
              >
                <div style={{
                  position: "absolute",
                  top: 3,
                  left: form.availability_alerts ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
                }} />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{
              fontSize: 12,
              color: "#F44336",
              marginBottom: 16,
              letterSpacing: "0.02em"
            }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              border: "none",
              backgroundColor: loading ? "#C8C4BA" : "#7A5F55",
              color: "#ECF0F1",
              fontSize: 13,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease",
              fontFamily: "inherit"
            }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* Login link */}
          <p style={{
            textAlign: "center",
            fontSize: 12,
            color: "#B0A898",
            marginTop: 20
          }}>
            Already have an account?{" "}
            <Link
              href="/login"
              style={{
                color: "#7A5F55",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}