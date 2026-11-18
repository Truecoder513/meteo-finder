// Variables d'environnement typées et validées au démarrage.
// Chaque variable est lue avec son nom complet (process.env.NEXT_PUBLIC_…) :
// c'est nécessaire pour que Next.js l'injecte dans le code envoyé au navigateur.
// Une valeur absente ou invalide fait échouer `next dev` / `next build` avec un
// message explicite, plutôt qu'une erreur réseau obscure plus tard.

type UrlOptions = { placeholders?: string[] };

function requiredUrl(name: string, value: string | undefined, { placeholders = [] }: UrlOptions = {}): string {
  if (!value || !value.trim()) {
    throw new Error(`[env] ${name} est manquante. Copiez .env.example en .env.local.`);
  }
  const trimmed = value.trim().replace(/\/+$/, ""); // retire un éventuel "/" final

  // Les modèles de tuiles contiennent {z}/{x}/{y} : on les remplace pour valider l'URL.
  const testable = placeholders.reduce((url, p) => url.replaceAll(`{${p}}`, "0"), trimmed);
  let url: URL;
  try {
    url = new URL(testable);
  } catch {
    throw new Error(`[env] ${name} n'est pas une URL valide : "${value}"`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`[env] ${name} doit utiliser http(s) : "${value}"`);
  }
  const missing = placeholders.filter((p) => !trimmed.includes(`{${p}}`));
  if (missing.length > 0) {
    throw new Error(`[env] ${name} doit contenir ${missing.map((p) => `{${p}}`).join(", ")} : "${value}"`);
  }
  return trimmed;
}

export const env = {
  geocodingApiUrl: requiredUrl("NEXT_PUBLIC_GEOCODING_API_URL", process.env.NEXT_PUBLIC_GEOCODING_API_URL),
  forecastApiUrl: requiredUrl("NEXT_PUBLIC_FORECAST_API_URL", process.env.NEXT_PUBLIC_FORECAST_API_URL),
  osmTileUrl: requiredUrl("NEXT_PUBLIC_OSM_TILE_URL", process.env.NEXT_PUBLIC_OSM_TILE_URL, {
    placeholders: ["z", "x", "y"],
  }),
  siteUrl: requiredUrl("NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL),
} as const;
