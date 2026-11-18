// Stockage des localités favorites dans le navigateur (localStorage).
// - Conservées après rechargement ou fermeture du navigateur.
// - Une localité ne figure qu'une seule fois (clé : identifiant).
// - Synchronisées entre onglets (événement "storage").
// - Si localStorage est indisponible (navigation privée stricte, quota), on garde
//   les favoris en mémoire pour la session plutôt que de planter.
import type { Localite } from "@/types/open-meteo";

export type Favorite = Pick<Localite, "id" | "name" | "admin1" | "admin2" | "latitude" | "longitude">;

const STORAGE_KEY = "meteo-benin:favoris";

let memory: Favorite[] = [];
let cachedRaw: string | null | undefined;
let cachedList: Favorite[] = [];
const listeners = new Set<() => void>();

function isFavorite(value: unknown): value is Favorite {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    typeof v.latitude === "number" &&
    typeof v.longitude === "number"
  );
}

/** Dédoublonne par identifiant en gardant la première occurrence. */
function unique(list: Favorite[]): Favorite[] {
  const seen = new Set<number>();
  return list.filter((f) => (seen.has(f.id) ? false : (seen.add(f.id), true)));
}

function parse(raw: string | null): Favorite[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? unique(data.filter(isFavorite)) : [];
  } catch {
    return []; // données corrompues : on repart d'une liste vide
  }
}

function readRaw(): string | null | undefined {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return undefined; // stockage indisponible
  }
}

/** Liste actuelle. Renvoie la même référence tant que rien n'a changé (requis par useSyncExternalStore). */
export function getFavorites(): Favorite[] {
  const raw = readRaw();
  if (raw === undefined) return memory;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedList = parse(raw);
  }
  return cachedList;
}

function save(list: Favorite[]) {
  const next = unique(list);
  memory = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage plein ou interdit : la liste en mémoire reste utilisable.
  }
  listeners.forEach((l) => l());
}

export function addFavorite(localite: Favorite) {
  const current = getFavorites();
  if (current.some((f) => f.id === localite.id)) return; // déjà présent : rien à faire
  const { id, name, admin1, admin2, latitude, longitude } = localite;
  save([...current, { id, name, admin1, admin2, latitude, longitude }]);
}

export function removeFavorite(id: number) {
  save(getFavorites().filter((f) => f.id !== id));
}

export function subscribeFavorites(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
