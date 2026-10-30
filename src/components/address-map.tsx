"use client"

import { useEffect } from "react"
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function Recenter({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lon], Math.max(map.getZoom(), 16), { animate: true })
  }, [lat, lon, map])
  return null
}

function DragHandler({
  onMove,
}: {
  onMove: (lat: number, lon: number) => void
}) {
  useMapEvents({
    click(event) {
      onMove(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

export function AddressMap({
  lat,
  lon,
  onMove,
  readOnly = false,
}: {
  lat: number
  lon: number
  onMove: (lat: number, lon: number) => void
  readOnly?: boolean
}) {
  return (
    <MapContainer
      key={readOnly ? "preview" : "pick"}
      center={[lat, lon]}
      zoom={16}
      scrollWheelZoom={!readOnly}
      dragging={!readOnly}
      className="z-0 h-56 w-full rounded-[12px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter lat={lat} lon={lon} />
      {!readOnly ? <DragHandler onMove={onMove} /> : null}
      <Marker
        position={[lat, lon]}
        icon={markerIcon}
        draggable={!readOnly}
        eventHandlers={
          readOnly
            ? undefined
            : {
                dragend: (event) => {
                  const marker = event.target as L.Marker
                  const pos = marker.getLatLng()
                  onMove(pos.lat, pos.lng)
                },
              }
        }
      />
    </MapContainer>
  )
}
