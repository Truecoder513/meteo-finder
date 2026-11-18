"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { BENIN_BOUNDS } from "@/lib/benin";
import { env } from "@/lib/env";

export type LeafletMapProps = { name: string; latitude: number; longitude: number };

// Marge autour du Bénin pour ne pas bloquer la carte pile sur la frontière.
const MAX_BOUNDS: L.LatLngBoundsExpression = [
  [BENIN_BOUNDS.south - 1, BENIN_BOUNDS.west - 1.5],
  [BENIN_BOUNDS.north + 1, BENIN_BOUNDS.east + 1.5],
];

const ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/**
 * Carte Leaflet pilotée directement (sans react-leaflet).
 * La carte est créée dans l'effet et détruite dans son nettoyage : chaque montage
 * repart d'un conteneur propre. Cela évite les erreurs « Map container is being
 * reused by another instance », « reading '_targets' » et « reading 'appendChild' »
 * quand React démonte puis remonte les effets (StrictMode en développement,
 * pages conservées en arrière-plan par Next.js lors de la navigation).
 */
export default function LeafletMap({ name, latitude, longitude }: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      center: [latitude, longitude],
      zoom: 11,
      minZoom: 6,
      maxBounds: MAX_BOUNDS,
      maxBoundsViscosity: 1,
      scrollWheelZoom: false,
      keyboard: true,
    });

    L.tileLayer(env.osmTileUrl, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

    // CircleMarker : pas d'image d'icône à charger (évite les soucis de bundling).
    L.circleMarker([latitude, longitude], {
      radius: 10,
      color: "#ffffff",
      weight: 3,
      fillColor: "#0a0a0a",
      fillOpacity: 1,
    })
      .bindTooltip(name, { direction: "top", offset: [0, -10], permanent: true })
      .addTo(map);

    // Recalcule la taille quand le conteneur change (redimensionnement, page ré-affichée).
    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove(); // détruit la carte et libère le conteneur
    };
  }, [name, latitude, longitude]);

  return <div ref={containerRef} className="size-full" />;
}
