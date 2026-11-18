// Versions mises en cache côté serveur des services (Server Components uniquement).
// Les requêtes elles-mêmes restent définies dans ./index.ts.
import { cacheLife } from "next/cache";
import { getForecast, getLocalite } from "./index";

export async function getLocaliteCached(id: number) {
  "use cache";
  cacheLife("days");
  return getLocalite(id);
}

export async function getForecastCached(latitude: number, longitude: number) {
  "use cache";
  cacheLife("hours");
  return getForecast(latitude, longitude);
}
