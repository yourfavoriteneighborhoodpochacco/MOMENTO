"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { login, getMe } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError(null)
    setLoading(true)
    try {
      const { access_token } = await login(email, password)
      const user = await getMe(access_token)
      signIn(access_token, user)
      router.push("/map")
    } catch (e) {
      setError("Incorrect email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      overflow: "auto",
      backgroundColor: "#ECF0F1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-cormorant), Georgia, serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        backgroundColor: "#FAFAF8",
        borderRadius: 20,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        overflow: "auto"
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
            Sign in to your account
          </p>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: "block",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9C9086",
              marginBottom: 6
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E0DDD6",
                backgroundColor: "#F5F3EF",
                fontSize: 14,
                color: "#262626",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9C9086",
              marginBottom: 6
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #E0DDD6",
                backgroundColor: "#F5F3EF",
                fontSize: 14,
                color: "#262626",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
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
            onClick={handleLogin}
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
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Register link */}
          <p style={{
            textAlign: "center",
            fontSize: 12,
            color: "#B0A898",
            marginTop: 20
          }}>
            No account?{" "}
            <Link
              href="/register"
              style={{
                color: "#7A5F55",
                textDecoration: "none",
                fontWeight: 500
              }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}