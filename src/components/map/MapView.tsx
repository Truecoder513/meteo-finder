"use client";

import dynamic from "next/dynamic";
import { MapSkeleton } from "@/components/skeletons/WeatherSkeletons";
import type { LeafletMapProps } from "./LeafletMap";

// Leaflet accède à `window` : chargement uniquement côté client.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div role="status" className="size-full">
      <span className="sr-only">Chargement de la carte…</span>
      <MapSkeleton />
    </div>
  ),
});

export function MapView({ name, latitude, longitude }: LeafletMapProps) {
  const osmUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=13/${latitude}/${longitude}`;

  return (
    <section aria-labelledby="map-title" className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface">
      <h2 id="map-title" className="sr-only">
        Carte de {name}
      </h2>
      {/* isolate : garde les calques Leaflet sous l'en-tête et la liste de recherche */}
      <div className="isolate aspect-4/3 w-full lg:aspect-auto lg:min-h-80 lg:flex-1">
        <LeafletMap name={name} latitude={latitude} longitude={longitude} />
      </div>
      {/* Alternative textuelle à la carte (1.1.1) */}
      <p className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-sm text-muted">
        <span className="tabular-nums">
          {latitude.toFixed(4)}, {longitude.toFixed(4)}
        </span>
        <a href={osmUrl} className="text-foreground underline underline-offset-2 hover:text-brand-strong">
          Ouvrir dans OpenStreetMap
        </a>
      </p>
    </section>
  );
}
