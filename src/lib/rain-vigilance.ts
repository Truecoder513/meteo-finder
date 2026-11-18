import type { DailyWeather } from "@/types/open-meteo";

/** Seuils de la « Vigilance pluie » (l'un OU l'autre suffit). */
export const RAIN_VIGILANCE = {
  /** Cumul de pluie prévu sur la journée, en mm */
  minPrecipitationMm: 20,
  /** Probabilité maximale de pluie sur la journée, en % */
  minProbabilityPercent: 80,
} as const;

/** Un jour est en vigilance pluie si le cumul atteint 20 mm ou si la probabilité atteint 80 %. */
export function isRainVigilance(precipitationMm: number | null, probabilityPercent: number | null): boolean {
  return (
    (precipitationMm ?? 0) >= RAIN_VIGILANCE.minPrecipitationMm ||
    (probabilityPercent ?? 0) >= RAIN_VIGILANCE.minProbabilityPercent
  );
}

/** Indices des jours en vigilance pluie dans les prévisions journalières. */
export function rainVigilanceDays(daily: DailyWeather): number[] {
  return daily.time
    .map((_, i) => i)
    .filter((i) => isRainVigilance(daily.precipitation_sum[i], daily.precipitation_probability_max[i]));
}
