// Toutes les requêtes HTTP de l'application (fetch natif).
// Utilisables côté serveur et côté client : aucun composant ne définit ses propres requêtes.
import { BENIN_COUNTRY_CODE } from "@/lib/benin";
import { env } from "@/lib/env";
import type {
  ForecastResponse,
  GeocodingGetResponse,
  GeocodingSearchResponse,
  Localite,
  OpenMeteoErrorResponse,
} from "@/types/open-meteo";

const GEOCODING_URL = env.geocodingApiUrl;
const FORECAST_URL = env.forecastApiUrl;

const CURRENT_VARS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "wind_speed_10m",
  "weather_code",
] as const;

const DAILY_VARS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "precipitation_probability_max",
] as const;

export const SEARCH_MIN_CHARS = 2;

/** Erreur levée quand Open-Meteo répond autrement que 2xx. */
export class OpenMeteoError extends Error {
  constructor(
    public readonly status: number,
    reason: string,
  ) {
    super(reason);
    this.name = "OpenMeteoError";
  }
}

type RequestOptions = { signal?: AbortSignal };

/** Au-delà de ce délai, la requête est abandonnée (évite un chargement infini). */
const REQUEST_TIMEOUT_MS = 10_000;

/** Combine le signal d'annulation de l'appelant et le délai maximum. */
function withTimeout(signal?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

/** true si l'erreur vient d'une annulation volontaire (nouvelle saisie), pas d'une panne. */
export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

async function getJson<T>(url: string, { signal }: RequestOptions = {}): Promise<T> {
  const res = await fetch(url, { signal: withTimeout(signal), headers: { Accept: "application/json" } });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as OpenMeteoErrorResponse | null;
    throw new OpenMeteoError(res.status, body?.reason ?? res.statusText);
  }
  return (await res.json()) as T;
}

const isInBenin = (l: Localite) => l.country_code === BENIN_COUNTRY_CODE;

/**
 * Recherche des localités du Bénin par leur nom.
 * Renvoie [] si la saisie fait moins de SEARCH_MIN_CHARS caractères.
 */
export async function searchLocalites(
  name: string,
  options: RequestOptions & { count?: number } = {},
): Promise<Localite[]> {
  const q = name.trim();
  if (q.length < SEARCH_MIN_CHARS) return [];

  const params = new URLSearchParams({
    name: q,
    countryCode: BENIN_COUNTRY_CODE,
    language: "fr",
    count: String(options.count ?? 10),
    format: "json",
  });
  const data = await getJson<GeocodingSearchResponse>(
    `${GEOCODING_URL}/search?${params}`,
    options,
  );
  // Double sécurité : on écarte tout résultat hors Bénin.
  return (data.results ?? []).filter(isInBenin);
}

/** Récupère une localité par son identifiant. `null` si inconnue ou hors Bénin. */
export async function getLocalite(id: number, options: RequestOptions = {}): Promise<Localite | null> {
  const params = new URLSearchParams({ id: String(id), language: "fr" });
  try {
    const localite = await getJson<GeocodingGetResponse>(`${GEOCODING_URL}/get?${params}`, options);
    return isInBenin(localite) ? localite : null;
  } catch (err) {
    if (err instanceof OpenMeteoError && (err.status === 400 || err.status === 404)) return null;
    throw err;
  }
}

/** Météo actuelle + prévisions journalières (7 jours) pour un point. */
export async function getForecast(
  latitude: number,
  longitude: number,
  options: RequestOptions = {},
): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toFixed(4),
    longitude: longitude.toFixed(4),
    current: CURRENT_VARS.join(","),
    daily: DAILY_VARS.join(","),
    timezone: "Africa/Porto-Novo",
    forecast_days: "7",
  });
  return getJson<ForecastResponse>(`${FORECAST_URL}?${params}`, options);
}
