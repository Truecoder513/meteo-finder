import type { Localite } from "@/types/open-meteo";

/** "Abomey-Calavi", 2394560 → "abomey-calavi-2394560" */
export function localiteSlug(l: Pick<Localite, "id" | "name">): string {
  const name = l.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${name}-${l.id}`;
}

/** "abomey-calavi-2394560" → 2394560 (null si invalide) */
export function idFromSlug(slug: string): number | null {
  const id = Number(slug.split("-").pop());
  return Number.isInteger(id) && id > 0 ? id : null;
}
