import { useCallback, useState } from "react";

export type GeolocationStatus =
  | "idle"
  | "prompt" // permission pas encore demandée : on explique avant de la demander
  | "locating"
  | "success"
  | "denied"
  | "unavailable" // navigateur sans géolocalisation, position introuvable ou délai dépassé
  | "insecure"; // la géolocalisation exige HTTPS (ou localhost)

export type Coordinates = { latitude: number; longitude: number };

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
      setStatus("unavailable");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStatus("success");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    );
  }, []);

  const check = useCallback(async () => {
    if (typeof window !== "undefined" && !window.isSecureContext) return setStatus("insecure");
    if (!("geolocation" in navigator)) return setStatus("unavailable");
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
