// Variables d'environnement réservées au SERVEUR (jamais envoyées au navigateur).
// `server-only` fait échouer le build si ce module est importé depuis un Client Component.
import "server-only";
import { requiredUrl } from "./env-validation";

/**
 * URL publique du site (metadataBase, URL canoniques).
 * Ordre de priorité :
 *  1. SITE_URL si elle est définie ;
 *  2. sur Vercel, le domaine de production fourni automatiquement (VERCEL_PROJECT_PRODUCTION_URL) ;
 *  3. en local, http://localhost:3000.
 */
function resolveSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const serverEnv = {
  siteUrl: requiredUrl("SITE_URL", resolveSiteUrl()),
} as const;
