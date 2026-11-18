// Variables d'environnement PUBLIQUES (envoyées au navigateur), typées et validées.
// Elles servent à la recherche et à la carte, qui s'exécutent côté client.
// Ce sont des URL d'APIs publiques : aucun secret ici.
// Variables réservées au serveur : voir ./env.server.ts.
//
// Chaque variable est lue avec son nom complet (process.env.NEXT_PUBLIC_…) :
// c'est nécessaire pour que Next.js l'injecte dans le code envoyé au navigateur.
import { requiredUrl } from "./env-validation";

export const env = {
  geocodingApiUrl: requiredUrl("NEXT_PUBLIC_GEOCODING_API_URL", process.env.NEXT_PUBLIC_GEOCODING_API_URL),
  forecastApiUrl: requiredUrl("NEXT_PUBLIC_FORECAST_API_URL", process.env.NEXT_PUBLIC_FORECAST_API_URL),
  osmTileUrl: requiredUrl("NEXT_PUBLIC_OSM_TILE_URL", process.env.NEXT_PUBLIC_OSM_TILE_URL, {
    placeholders: ["z", "x", "y"],
  }),
} as const;
