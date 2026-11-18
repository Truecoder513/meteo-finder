// Codes météo WMO utilisés par Open-Meteo → libellé FR + type d'icône.
export type WeatherKind = "clear" | "partly" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm";

type WeatherInfo = { label: string; kind: WeatherKind };

const CODES: Record<number, WeatherInfo> = {
  0: { label: "Ciel dégagé", kind: "clear" },
  1: { label: "Plutôt dégagé", kind: "partly" },
  2: { label: "Partiellement nuageux", kind: "partly" },
  3: { label: "Couvert", kind: "cloudy" },
  45: { label: "Brouillard", kind: "fog" },
  48: { label: "Brouillard givrant", kind: "fog" },
  51: { label: "Bruine légère", kind: "drizzle" },
  53: { label: "Bruine", kind: "drizzle" },
  55: { label: "Bruine dense", kind: "drizzle" },
  56: { label: "Bruine verglaçante", kind: "drizzle" },
  57: { label: "Bruine verglaçante dense", kind: "drizzle" },
  61: { label: "Pluie faible", kind: "rain" },
  63: { label: "Pluie modérée", kind: "rain" },
  65: { label: "Pluie forte", kind: "rain" },
  66: { label: "Pluie verglaçante", kind: "rain" },
  67: { label: "Pluie verglaçante forte", kind: "rain" },
  71: { label: "Neige faible", kind: "snow" },
  73: { label: "Neige", kind: "snow" },
  75: { label: "Neige forte", kind: "snow" },
  77: { label: "Grains de neige", kind: "snow" },
  80: { label: "Averses faibles", kind: "rain" },
  81: { label: "Averses", kind: "rain" },
  82: { label: "Averses violentes", kind: "rain" },
  85: { label: "Averses de neige", kind: "snow" },
  86: { label: "Averses de neige fortes", kind: "snow" },
  95: { label: "Orage", kind: "storm" },
  96: { label: "Orage avec grêle", kind: "storm" },
  99: { label: "Orage violent avec grêle", kind: "storm" },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return CODES[code] ?? { label: "Conditions inconnues", kind: "cloudy" };
}
