"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useFavorites } from "@/app/hooks/useFavorites";
import { Skeleton } from "@/components/skeletons/Skeleton";
import { localiteSlug } from "@/lib/slug";
import { StarIcon } from "./StarIcon";

/** Section « Mes favoris » de l'accueil (ancre #favoris). */
export function FavoritesList() {
  const { favorites, remove } = useFavorites();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [announce, setAnnounce] = useState("");

  return (
    <section id="favoris" aria-labelledby="favoris-title" className="scroll-mt-20 pb-12">
      <h2
        id="favoris-title"
        ref={headingRef}
        tabIndex={-1}
        className="mb-2 flex items-center gap-2 text-sm font-medium text-muted outline-none"
      >
        <StarIcon className="size-4" />
        Mes favoris
      </h2>

      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>

      {favorites === null ? (
        // Lecture du stockage local en cours
        <div role="status" className="border-t border-border">
          <span className="sr-only">Chargement des favoris…</span>
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} aria-hidden className="flex min-h-14 items-center justify-between border-b border-border px-1">
              <span className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </span>
              <Skeleton className="size-6" />
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <p className="border-t border-border py-4 text-sm text-muted">
          Aucun favori pour l’instant. Ouvrez une localité puis choisissez « Ajouter aux favoris » pour la
          retrouver ici en un clic.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <li key={f.id} className="flex items-stretch border-b border-border">
              <Link
                href={`/meteo/${localiteSlug(f)}`}
                className="flex min-h-14 flex-1 flex-col justify-center px-1 py-3 transition-colors hover:bg-subtle"
              >
                <span className="font-medium">{f.name}</span>
                {f.admin1 && <span className="text-sm text-muted">{f.admin1}</span>}
              </Link>
              <button
                type="button"
                onClick={() => {
                  remove(f.id);
                  setAnnounce(`${f.name} retirée des favoris.`);
                  headingRef.current?.focus(); // le bouton disparaît : on garde le focus dans la section
                }}
                className="inline-flex min-w-11 items-center justify-center text-muted transition-colors hover:bg-subtle hover:text-foreground"
              >
                <span className="sr-only">Retirer {f.name} des favoris</span>
                <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
