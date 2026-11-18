"use client";

import { useState } from "react";
import { useFavorites } from "@/app/hooks/useFavorites";
import { Skeleton } from "@/components/skeletons/Skeleton";
import type { Favorite } from "@/lib/favorites-store";
import { StarIcon } from "./StarIcon";

/** Ajoute / retire la localité des favoris. */
export function FavoriteButton({ localite }: { localite: Favorite }) {
  const { favorites, isFavorite, toggle } = useFavorites();
  const [announce, setAnnounce] = useState("");

  // Favoris pas encore lus (rendu serveur / avant hydratation) : squelette du bouton.
  if (favorites === null) {
    return <Skeleton className="h-11 w-48 rounded-lg" />;
  }

  const active = isFavorite(localite.id);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          toggle(localite);
          setAnnounce(active ? `${localite.name} retirée des favoris.` : `${localite.name} ajoutée aux favoris.`);
        }}
        className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
          active
            ? "border-foreground bg-foreground text-white hover:bg-foreground/85"
            : "border-border-strong bg-surface text-foreground hover:bg-subtle"
        }`}
      >
        <StarIcon filled={active} />
        {active ? "Retirer des favoris" : "Ajouter aux favoris"}
      </button>
      {/* Confirmation pour les lecteurs d'écran (4.1.3) */}
      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>
    </>
  );
}
