"use client"

import { useEffect, useState } from "react"
import { Location, AvailabilityScore } from "@/types"
import { getAvailability } from "@/lib/api"

interface LocationPanelProps {
  location: Location | null
  onClose: () => void
}

const LABEL_COLORS: Record<string, string> = {
  "virtually empty": "#4CAF50",
  "plenty of space": "#8BC34A",
  "moderate":        "#FFC107",
  "filling up":      "#FF5722",
  "virtually full":  "#F44336"
}

export default function LocationPanel({ location, onClose }: LocationPanelProps) {
  const [score, setScore] = useState<AvailabilityScore | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location) {
      setScore(null)
      return
    }
    setLoading(true)
    getAvailability(location.id)
      .then(setScore)
      .catch(() => setScore(null))
      .finally(() => setLoading(false))
  }, [location?.id])

  const isOpen = location !== null

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "33.333%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        padding: "24px 0 24px 24px"
      }}
    >
      {/* Card */}
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#FAFAF8",
          borderRadius: 20,
          boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          transform: isOpen ? "translateX(0)" : "translateX(calc(-100% - 24px))",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: "all",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(250,250,248,0.85)",
            border: "none",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            cursor: "pointer",
            color: "#7A5F55",
            zIndex: 11,
            backdropFilter: "blur(4px)"
          }}
        >
          ✕
        </button>

        {location && (
          <>
            {/* Banner */}
            <div
              style={{
                width: "100%",
                height: "80px",
                flexShrink: 0,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #DDD9D0 0%, #C8C4BA 50%, #D4D0C8 100%)"
              }} />
              <span style={{
                position: "relative",
                color: "#A09890",
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}>
                {location.category}
              </span>
            </div>

            {/* Content */}
            <div style={{
              padding: "20px 22px",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              overflow: "hidden"
            }}>

              {/* Name and tag */}
              <div>
                <p style={{
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#B0A898",
                  marginBottom: 5
                }}>
                  {location.category}
                </p>
                <h2 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#262626",
                  marginBottom: 4,
                  lineHeight: 1.3
                }}>
                  {location.name}
                </h2>
                {location.admin_tag && (
                  <p style={{
                    fontSize: 11,
                    color: "#C0B8B0",
                    letterSpacing: "0.05em"
                  }}>
                    {location.admin_tag}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div style={{
                backgroundColor: "#F0EDE8",
                borderRadius: 12,
                padding: "14px 16px",
                flexShrink: 0
              }}>
                {loading ? (
                  <p style={{ fontSize: 12, color: "#9C9086" }}>
                    Loading availability...
                  </p>
                ) : score ? (
                  <>
                    <p style={{
                      fontSize: 17,
                      fontWeight: 600,
                      color: LABEL_COLORS[score.label] ?? "#262626",
                      marginBottom: 3
                    }}>
                      {score.label}
                    </p>
                    <p style={{ fontSize: 11, color: "#B0A898" }}>
                      {score.score} / 100
                    </p>
                  </>
                ) : (
                  <p style={{ fontSize: 12, color: "#9C9086" }}>
                    No availability data yet
                  </p>
                )}
              </div>

              {/* Space details */}
              <div style={{
                borderTop: "1px solid #ECEAE4",
                paddingTop: 16,
                flexShrink: 0
              }}>
                <p style={{
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#B0A898",
                  marginBottom: 14
                }}>
                  Space details
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#7A7570" }}>Total capacity</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#262626" }}>
                      {location.capacity_estimate}
                    </span>
                  </div>
                  {score && (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, color: "#7A7570" }}>Est. available</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#4CAF50" }}>
                          {Math.round((score.score / 100) * location.capacity_estimate)}
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 13, color: "#7A7570" }}>Est. occupied</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#262626" }}>
                          {Math.round(((100 - score.score) / 100) * location.capacity_estimate)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  )
}