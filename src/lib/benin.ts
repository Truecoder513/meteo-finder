import type { Localite } from "@/types/open-meteo";

export const BENIN_COUNTRY_CODE = "BJ";

/** Rectangle englobant le territoire béninois (filtre rapide, pas une frontière exacte). */
export const BENIN_BOUNDS = {
  south: 6.14,
  north: 12.42,
  west: 0.77,
  east: 3.85,
} as const;

/** Centre approximatif du pays, pour la carte par défaut. */
export const BENIN_CENTER: [number, number] = [9.3, 2.3];

export function isInBeninBounds(latitude: number, longitude: number): boolean {
  return (
    latitude >= BENIN_BOUNDS.south &&
    latitude <= BENIN_BOUNDS.north &&
    longitude >= BENIN_BOUNDS.west &&
    longitude <= BENIN_BOUNDS.east
  );
}

/**
 * Grandes villes mises en avant sur l'accueil et pré-rendues (SEO).
 * Identifiants GeoNames vérifiés via l'API geocoding d'Open-Meteo.
 */
export const GRANDES_VILLES: Pick<Localite, "id" | "name" | "admin1" | "latitude" | "longitude">[] = [
  { id: 2394819, name: "Cotonou", admin1: "Littoral", latitude: 6.36536, longitude: 2.41833 },
  { id: 2392087, name: "Porto-Novo", admin1: "Ouémé", latitude: 6.49646, longitude: 2.60359 },
  { id: 2392204, name: "Parakou", admin1: "Borgou", latitude: 9.33716, longitude: 2.63031 },
  { id: 2395914, name: "Abomey-Calavi", admin1: "Atlantique", latitude: 6.44852, longitude: 2.35566 },
  { id: 2394560, name: "Djougou", admin1: "Donga", latitude: 9.70853, longitude: 1.66598 },
  { id: 2395049, name: "Bohicon", admin1: "Zou", latitude: 7.17826, longitude: 2.0667 },
  { id: 2392601, name: "Natitingou", admin1: "Atacora", latitude: 10.30416, longitude: 1.37962 },
  { id: 2392308, name: "Ouidah", admin1: "Atlantique", latitude: 6.36307, longitude: 2.08506 },
  { id: 2392897, name: "Lokossa", admin1: "Mono", latitude: 6.63869, longitude: 1.71674 },
  { id: 2393693, name: "Kandi", admin1: "Alibori", latitude: 11.13417, longitude: 2.93861 },
  { id: 2395915, name: "Abomey", admin1: "Zou", latitude: 7.18286, longitude: 1.99119 },
  { id: 2392837, name: "Malanville", admin1: "Alibori", latitude: 11.86819, longitude: 3.38327 },
];
