import { useCallback, useState } from "react";

export type GeolocationStatus =
  | "idle"
  | "prompt" // permission pas encore demandée : on explique avant de la demander
  | "locating"
  | "success"
  | "denied" // l'utilisateur ou le navigateur a refusé l'accès
  | "unavailable" // l'appareil n'a pas pu fournir de position (localisation désactivée au niveau du système…)
  | "timeout" // la position n'est pas arrivée à temps
  | "unsupported" // navigateur sans API de géolocalisation
  | "insecure"; // la géolocalisation exige HTTPS (ou localhost)

export type Coordinates = { latitude: number; longitude: number };

/**
 * Tentatives successives : d'abord rapide (réseau Wi-Fi/IP, position récente acceptée),
 * puis précise (GPS si disponible) avec un délai plus long.
 * Beaucoup d'ordinateurs échouent sur la première et réussissent sur la seconde, ou l'inverse.
 */
const ATTEMPTS: PositionOptions[] = [
  { enableHighAccuracy: false, timeout: 15_000, maximumAge: 10 * 60_000 },
  { enableHighAccuracy: true, timeout: 25_000, maximumAge: 0 },
];

/**
 * Gère la demande d'autorisation et la lecture de la position.
 * - `check()` consulte l'état de la permission sans déclencher de fenêtre du navigateur.
 * - `request()` déclenche la demande d'autorisation du navigateur puis lit la position.
 */
export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");

    const attempt = (index: number) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
          setStatus("success");
        },
        (err) => {
          // Détail technique pour le diagnostic uniquement (jamais affiché à l'utilisateur).
          console.warn(`[géolocalisation] tentative ${index + 1} : code ${err.code} — ${err.message}`);

          if (err.code === err.PERMISSION_DENIED) return setStatus("denied");
          if (index + 1 < ATTEMPTS.length) return attempt(index + 1); // on retente autrement
          setStatus(err.code === err.TIMEOUT ? "timeout" : "unavailable");
        },
        ATTEMPTS[index],
      );
    };
    attempt(0);
  }, []);

  const check = useCallback(async () => {
    if (typeof window !== "undefined" && !window.isSecureContext) return setStatus("insecure");
    if (!("geolocation" in navigator)) return setStatus("unsupported");
    try {
      const permission = await navigator.permissions?.query({ name: "geolocation" });
      if (permission?.state === "granted") return request();
      if (permission?.state === "denied") return setStatus("denied");
    } catch {
      // API Permissions absente (certains Safari) : on passe par l'explication.
    }
    setStatus("prompt");
  }, [request]);

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, coords, check, request, reset };
}
