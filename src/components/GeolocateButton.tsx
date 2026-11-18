"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGeolocation } from "@/app/hooks/useGeolocation";
import { isInBeninBounds } from "@/lib/benin";
import { BeninOnlyNotice } from "./BeninOnlyNotice";

const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:opacity-70";
const btnPrimary = `${btn} bg-foreground text-white hover:bg-foreground/85`;
const btnSecondary = `${btn} border border-border-strong bg-surface text-foreground hover:bg-subtle`;

function PinIcon({ spinning = false }: { spinning?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`size-5 ${spinning ? "animate-spin" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

export function GeolocateButton() {
  const router = useRouter();
  const { status, coords, check, request, reset } = useGeolocation();
  const panelRef = useRef<HTMLDivElement>(null);

  const outside =
    status === "success" && coords !== null && !isInBeninBounds(coords.latitude, coords.longitude);

  useEffect(() => {
    if (status === "success" && coords && !outside) {
      router.push(`/meteo/position?lat=${coords.latitude.toFixed(4)}&lon=${coords.longitude.toFixed(4)}`);
    }
  }, [status, coords, outside, router]);

  // Déplace le focus vers le panneau quand il apparaît (clavier / lecteurs d'écran).
  useEffect(() => {
    if (status === "prompt" || status === "denied" || status === "unavailable" || status === "insecure") {
      panelRef.current?.focus();
    }
  }, [status]);

  if (status === "prompt") {
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        role="region"
        aria-labelledby="geo-title"
        className="w-full rounded-lg border border-border-strong bg-surface p-5 text-left outline-none"
      >
        <h2 id="geo-title" className="font-semibold">
          Autoriser l’accès à votre position ?
        </h2>
        <p className="mt-1 text-sm text-muted">
          Votre position sert uniquement à afficher la météo de l’endroit où vous êtes. Elle
          n’est ni enregistrée ni partagée. Votre navigateur va vous demander confirmation.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={request} className={btnPrimary}>
            <PinIcon /> Autoriser
          </button>
          <button type="button" onClick={reset} className={btnSecondary}>
            Annuler
          </button>
        </div>
      </div>
    );
  }

  if (status === "denied" || status === "unavailable" || status === "insecure") {
    const message = {
      denied:
        "L’accès à la position a été refusé. Pour l’activer, cliquez sur l’icône à gauche de l’adresse du site, autorisez « Position », puis réessayez. Vous pouvez aussi rechercher votre localité.",
      unavailable:
        "Impossible de déterminer votre position pour le moment. Réessayez ou recherchez votre localité.",
      insecure: "La géolocalisation nécessite une connexion sécurisée (HTTPS).",
    }[status];
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        role="alert"
        className="w-full rounded-lg border border-alert bg-surface p-5 text-left outline-none"
      >
        <p className="text-sm">{message}</p>
        <button type="button" onClick={check} className={`${btnSecondary} mt-3`}>
          Réessayer
        </button>
      </div>
    );
  }

  if (outside) {
    return (
      <div className="w-full space-y-3 text-left">
        <BeninOnlyNotice />
        <button type="button" onClick={reset} className={btnSecondary}>
          Fermer
        </button>
      </div>
    );
  }

  const busy = status === "locating" || status === "success";
  return (
    <button
      type="button"
      onClick={check}
      disabled={busy}
      aria-busy={busy}
      className={`${btnSecondary} h-12 w-full`}
    >
      <PinIcon spinning={busy} />
      {busy ? "Localisation…" : "Utiliser ma position"}
    </button>
  );
}
