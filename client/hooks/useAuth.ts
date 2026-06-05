"use client"

import { useState, useEffect } from "react"
import { User } from "@/types"
import { getMe } from "@/lib/api"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("momento_token")
    if (stored) {
      setToken(stored)
      getMe(stored)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("momento_token")
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  function signIn(newToken: string, newUser: User) {
    localStorage.setItem("momento_token", newToken)
    setToken(newToken)
    setUser(newUser)
  }

  function signOut() {
    localStorage.removeItem("momento_token")
    setToken(null)
    setUser(null)
  }

  return { user, token, loading, signIn, signOut }
}