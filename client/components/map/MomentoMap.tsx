"use client"

import { useEffect, useState } from "react"
import Map, { NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { getLocations } from "@/lib/api"
import { Location } from "@/types"
import LocationMarker from "./LocationMarker"
import LocationPanel from "./LocationPanel"

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY

export default function MomentoMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [viewState, setViewState] = useState(() => {
    if (typeof window === "undefined") return {
      latitude: 33.6461,
      longitude: -117.8427,
      zoom: 15
    }
    const saved = localStorage.getItem("momento_viewport")
    if (saved) {
      try { return JSON.parse(saved) } catch { }
    }
    return {
      latitude: 33.6461,
      longitude: -117.8427,
      zoom: 15
    }
  })

  useEffect(() => {
    getLocations().then(setLocations).catch(console.error)
  }, [])

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden"
    }}>
      <Map
        {...viewState}
        onMove={e => {
          setViewState(e.viewState)
          localStorage.setItem("momento_viewport", JSON.stringify(e.viewState))
        }}
        mapStyle={process.env.NEXT_PUBLIC_MAPTILER_STYLE}
        style={{ width: "100%", height: "100%" }}
        onClick={() => setSelectedLocation(null)}
      >
        <NavigationControl position="bottom-right" />
        {locations.map(location => (
          <LocationMarker
            key={location.id}
            location={location}
            isSelected={selectedLocation?.id === location.id}
            onSelect={setSelectedLocation}
          />
        ))}
      </Map>

      <LocationPanel
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
      />
    </div>
  )
}