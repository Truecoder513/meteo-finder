// Types des réponses des APIs Open-Meteo.
// Doc : https://open-meteo.com/en/docs/geocoding-api et https://open-meteo.com/en/docs

/* ------------------------------------------------------------------ */
/* Geocoding — https://geocoding-api.open-meteo.com/v1                 */
/* ------------------------------------------------------------------ */

/** Une localité renvoyée par /v1/search (dans `results`) ou /v1/get. */
export type Localite = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  /** Code GeoNames : PPL (lieu habité), PPLA (chef-lieu), PPLC (capitale), AIRP… */
  feature_code?: string;
  /** Code pays ISO 3166-1 alpha-2 — toujours "BJ" pour ce service. */
  country_code: string;
  country_id?: number;
  country?: string;
  timezone?: string;
  population?: number;
  postcodes?: string[];
  /** Département */
  admin1?: string;
  admin1_id?: number;
  /** Commune */
  admin2?: string;
  admin2_id?: number;
  admin3?: string;
  admin3_id?: number;
  admin4?: string;
  admin4_id?: number;
};

/** Réponse de GET /v1/search. `results` est absent quand rien ne correspond. */
export type GeocodingSearchResponse = {
  results?: Localite[];
  generationtime_ms: number;
};

/** Réponse de GET /v1/get?id=… */
export type GeocodingGetResponse = Localite;

/* ------------------------------------------------------------------ */
/* Prévisions — https://api.open-meteo.com/v1/forecast                 */
/* ------------------------------------------------------------------ */

/** Variables `current` demandées par le service. */
export type CurrentWeather = {
  /** Heure locale ISO 8601 (ex. "2026-11-18T17:45") */
  time: string;
  /** Pas de mesure en secondes */
  interval: number;
  temperature_2m: number;
  apparent_temperature: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  /** Code météo WMO */
  weather_code: number;
};

/** Variables `daily` demandées par le service (une valeur par jour). */
export type DailyWeather = {
  /** Dates ISO 8601 (ex. "2026-11-18") */
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
};

/** Unités renvoyées avec chaque bloc (ex. { temperature_2m: "°C" }). */
export type Units<T> = { [K in keyof T]: string };

/** Réponse de GET /v1/forecast. */
export type ForecastResponse = {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current_units: Units<CurrentWeather>;
  current: CurrentWeather;
  daily_units: Units<DailyWeather>;
  daily: DailyWeather;
};

/* ------------------------------------------------------------------ */
/* Erreurs                                                             */
/* ------------------------------------------------------------------ */

/** Corps d'erreur commun aux APIs Open-Meteo (HTTP 400/404). */
export type OpenMeteoErrorResponse = {
  error: true;
  reason: string;
};
