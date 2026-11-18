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

// Messages par cause, avec la marche à suivre (jamais de détail technique).
const GEO_ERRORS = {
  denied: {
    title: "L’accès à votre position est refusé.",
    steps: [
      "Cliquez sur l’icône à gauche de l’adresse du site, autorisez « Position », puis réessayez.",
    ],
  },
  unavailable: {
    title: "Votre appareil n’a pas pu fournir votre position.",
    steps: [
      "Vérifiez que la localisation est activée sur votre appareil.",
      "Sur Mac : Réglages Système › Confidentialité et sécurité › Service de localisation, puis autorisez votre navigateur.",
      "Sur Windows : Paramètres › Confidentialité › Localisation.",
      "Sur téléphone : activez la localisation (GPS) dans les réglages rapides.",
    ],
  },
  timeout: {
    title: "La localisation a pris trop de temps.",
    steps: ["Activez le Wi-Fi ou placez-vous près d’une fenêtre, puis réessayez."],
  },
  unsupported: {
    title: "Votre navigateur ne permet pas la géolocalisation.",
    steps: ["Essayez avec un navigateur récent (Chrome, Firefox, Safari, Edge)."],
  },
  insecure: {
    title: "La géolocalisation nécessite une connexion sécurisée (HTTPS).",
    steps: ["Ouvrez le site via son adresse https://."],
  },
} as const;

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
    if (status !== "idle" && status !== "locating" && status !== "success") {
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

  if (
    status === "denied" ||
    status === "unavailable" ||
    status === "timeout" ||
    status === "unsupported" ||
    status === "insecure"
  ) {
    const { title, steps } = GEO_ERRORS[status];
    return (
      <div
        ref={panelRef}
        tabIndex={-1}
        role="alert"
        className="w-full rounded-lg border border-alert bg-surface p-5 text-left outline-none"
      >
        <p className="font-semibold">{title}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
          <li>Vous pouvez aussi rechercher votre localité par son nom.</li>
        </ul>
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
      {busy ? "Localisation… (quelques secondes)" : "Utiliser ma position"}
    </button>
  );
}
