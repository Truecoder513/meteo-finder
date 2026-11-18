import { useCallback, useSyncExternalStore } from "react";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  subscribeFavorites,
  type Favorite,
} from "@/lib/favorites-store";

// Côté serveur, les favoris sont inconnus (ils vivent dans le navigateur) : null.
const getServerSnapshot = () => null;

/**
 * Favoris de l'utilisateur.
 * `favorites` vaut null tant que la page n'est pas hydratée (afficher un squelette).
 */
export function useFavorites() {
  const favorites = useSyncExternalStore<Favorite[] | null>(
    subscribeFavorites,
    getFavorites,
    getServerSnapshot,
  );

  const isFavorite = useCallback(
    (id: number) => favorites?.some((f) => f.id === id) ?? false,
    [favorites],
  );

  const toggle = useCallback(
    (localite: Favorite) => {
      if (isFavorite(localite.id)) removeFavorite(localite.id);
      else addFavorite(localite);
    },
    [isFavorite],
  );

  return { favorites, isFavorite, add: addFavorite, remove: removeFavorite, toggle };
}
