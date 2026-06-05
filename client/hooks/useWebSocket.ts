"use client"

import { useEffect, useRef, useCallback } from "react"
import { WebSocketScoreUpdate } from "@/types"

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace("http", "ws")

export function useWebSocket(
  locationId: string | null,
  onUpdate: (update: WebSocketScoreUpdate) => void
) {
  const wsRef = useRef<WebSocket | null>(null)
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (!locationId) return

    const ws = new WebSocket(`${WS_URL}/ws/${locationId}`)
    wsRef.current = ws

    ws.onmessage = (event) => {
      try {
        const data: WebSocketScoreUpdate = JSON.parse(event.data)
        onUpdateRef.current(data)
      } catch {
        console.error("Failed to parse WebSocket message")
      }
    }

    ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [locationId])
}