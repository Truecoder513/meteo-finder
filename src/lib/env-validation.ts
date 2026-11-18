// Validation commune des variables d'environnement de type URL.

type UrlOptions = { placeholders?: string[] };

/**
 * Vérifie qu'une variable est présente, est une URL http(s) valide et contient
 * les éventuels marqueurs attendus (ex. {z}/{x}/{y} pour les tuiles).
 * Lève une erreur explicite sinon. Retire le "/" final.
 */
export function requiredUrl(name: string, value: string | undefined, { placeholders = [] }: UrlOptions = {}): string {
  if (!value || !value.trim()) {
    throw new Error(`[env] ${name} est manquante. Copiez .env.example en .env.local.`);
  }
  const trimmed = value.trim().replace(/\/+$/, "");

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
