"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";
import { BENIN_BOUNDS } from "@/lib/benin";
import { env } from "@/lib/env";

export type LeafletMapProps = { name: string; latitude: number; longitude: number };

// Marge autour du Bénin pour ne pas bloquer la carte pile sur la frontière.
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [BENIN_BOUNDS.south - 1, BENIN_BOUNDS.west - 1.5],
  [BENIN_BOUNDS.north + 1, BENIN_BOUNDS.east + 1.5],
];

export default function LeafletMap({ name, latitude, longitude }: LeafletMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={11}
      minZoom={6}
      maxBounds={MAX_BOUNDS}
      maxBoundsViscosity={1}
      scrollWheelZoom={false}
      keyboard
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url={env.osmTileUrl}
      />
      {/* CircleMarker : pas d'image d'icône à charger (évite les soucis de bundling) */}
      <CircleMarker
        center={[latitude, longitude]}
        radius={10}
        pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#0a0a0a", fillOpacity: 1 }}
      >
        <Tooltip direction="top" offset={[0, -10]} permanent>
          {name}
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
