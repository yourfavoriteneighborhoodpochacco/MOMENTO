"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Location, AvailabilityScore } from "@/types"
import { getLocation, getSublocations, getAvailability } from "@/lib/api"
import { useWebSocket } from "@/hooks/useWebSocket"

const LABEL_COLORS: Record<string, string> = {
  "virtually empty":  "#4CAF50",
  "plenty of space":  "#8BC34A",
  "moderate":         "#FFC107",
  "filling up":       "#FF5722",
  "virtually full":   "#F44336"
}

export default function LocationDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [location, setLocation] = useState<Location | null>(null)
  const [sublocations, setSublocations] = useState<Location[]>([])
  const [score, setScore] = useState<AvailabilityScore | null>(null)
  const [subScores, setSubScores] = useState<Record<string, AvailabilityScore>>({})
  const [loading, setLoading] = useState(true)

  useWebSocket(id as string, (update) => {
    if (update.location_id === id) {
      setScore(prev => prev ? { ...prev, score: update.score, label: update.label } : prev)
    }
  })

  useEffect(() => {
    if (!id) return
    Promise.all([
      getLocation(id as string),
      getSublocations(id as string),
      getAvailability(id as string)
    ]).then(([loc, subs, avail]) => {
      setLocation(loc)
      setSublocations(subs)
      setScore(avail)
      return Promise.all(subs.map(s => getAvailability(s.id).then(a => ({ id: s.id, score: a }))))
    }).then(results => {
      const map: Record<string, AvailabilityScore> = {}
      results.forEach(r => { map[r.id] = r.score })
      setSubScores(map)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ECF0F1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-cormorant), Georgia, serif"
    }}>
      <p style={{ color: "#B0A898" }}>Loading...</p>
    </div>
  )

  if (!location) return null

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#ECF0F1",
      fontFamily: "var(--font-cormorant), Georgia, serif",
      padding: "40px 24px"
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

        <Link href="/map" style={{ textDecoration: "none" }}>
          <p style={{
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#9C9086",
            marginBottom: 8
          }}>
            ← Back to map
          </p>
        </Link>

        {/* Main location card */}
        <div style={{
          backgroundColor: "#FAFAF8",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
        }}>
          <div style={{
            height: 100,
            background: "linear-gradient(135deg, #DDD9D0 0%, #C8C4BA 50%, #D4D0C8 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#A09890"
            }}>
              {location.category}
            </span>
          </div>

          <div style={{ padding: "24px" }}>
            <p style={{
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#B0A898",
              marginBottom: 6
            }}>
              {location.category}
            </p>
            <h1 style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#262626",
              marginBottom: 4,
              lineHeight: 1.3
            }}>
              {location.name}
            </h1>
            {location.admin_tag && (
              <p style={{ fontSize: 12, color: "#C0B8B0", marginBottom: 20 }}>
                {location.admin_tag}
              </p>
            )}

            {score && (
              <div style={{
                backgroundColor: "#F0EDE8",
                borderRadius: 12,
                padding: "16px",
                marginBottom: 20
              }}>
                <p style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: LABEL_COLORS[score.label] ?? "#262626",
                  marginBottom: 4
                }}>
                  {score.label}
                </p>
                <p style={{ fontSize: 12, color: "#B0A898" }}>
                  Score: {score.score} / 100
                </p>
              </div>
            )}

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

        {/* Sublocations */}
        {sublocations.length > 0 && (
          <div style={{
            backgroundColor: "#FAFAF8",
            borderRadius: 20,
            padding: "24px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)"
          }}>
            <p style={{
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#B0A898",
              marginBottom: 16
            }}>
              Floors & zones
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sublocations.map(sub => {
                const subScore = subScores[sub.id]
                return (
                  <div
                    key={sub.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "12px 14px",
                      backgroundColor: "#F5F3EF",
                      borderRadius: 10
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#262626", marginBottom: 2 }}>
                        {sub.name}
                      </p>
                      <p style={{ fontSize: 11, color: "#B0A898" }}>
                        Capacity: {sub.capacity_estimate}
                      </p>
                    </div>
                    {subScore && (
                      <div style={{ textAlign: "right" }}>
                        <p style={{
                          fontSize: 12,
                          fontWeight: 500,
                          color: LABEL_COLORS[subScore.label] ?? "#262626",
                          marginBottom: 2
                        }}>
                          {subScore.label}
                        </p>
                        <p style={{ fontSize: 11, color: "#B0A898" }}>
                          {subScore.score} / 100
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}