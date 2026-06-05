"use client"

import { Marker } from "react-map-gl/maplibre"
import { Location } from "@/types"

interface LocationMarkerProps {
  location: Location
  isSelected: boolean
  onSelect: (location: Location) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  study: "#7A5F55",
  gym:   "#5C7A6B",
  cafe:  "#8C7355"
}

export default function LocationMarker({
  location,
  isSelected,
  onSelect
}: LocationMarkerProps) {
  const color = CATEGORY_COLORS[location.category] ?? "#7A5F55"

  return (
    <Marker
      latitude={location.latitude}
      longitude={location.longitude}
      onClick={e => {
        e.originalEvent.stopPropagation()
        onSelect(location)
      }}
    >
      <div
        style={{
          width: isSelected ? 20 : 14,
          height: isSelected ? 20 : 14,
          borderRadius: "50%",
          backgroundColor: color,
          border: `2px solid ${isSelected ? "#ECF0F1" : "white"}`,
          boxShadow: isSelected
            ? "0 0 0 3px rgba(122,95,85,0.4)"
            : "0 2px 6px rgba(0,0,0,0.25)",
          cursor: "pointer",
          transition: "all 0.2s ease"
        }}
      />
    </Marker>
  )
}