"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebouncer } from "@/app/hooks/useDebouncer";
import { SEARCH_MIN_CHARS, searchLocalites } from "@/app/services";
import { SearchResultsSkeleton } from "@/components/skeletons/WeatherSkeletons";
import { localiteSlug } from "@/lib/slug";
import type { Localite } from "@/types/open-meteo";

const DEBOUNCE_MS = 400;

type Status = "idle" | "loading" | "success" | "error";
type SearchState = { query: string; status: Status; results: Localite[] };

export function SearchBox({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [search, setSearch] = useState<SearchState>({ query: "", status: "idle", results: [] });

  // La requête ne part que quand l'utilisateur a fini de taper.
  const debouncedQuery = useDebouncer(query.trim(), DEBOUNCE_MS);
  const tooShort = debouncedQuery.length < SEARCH_MIN_CHARS;

  useEffect(() => {
    if (tooShort) return;
    // Annule la requête précédente si une nouvelle saisie arrive.
    const controller = new AbortController();
    searchLocalites(debouncedQuery, { signal: controller.signal })
      .then((results) => setSearch({ query: debouncedQuery, status: "success", results }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setSearch({ query: debouncedQuery, status: "error", results: [] });
      });
    return () => controller.abort();
  }, [debouncedQuery, tooShort]);

  // État déduit : tant que la réponse ne correspond pas à la saisie, on est « en cours ».
  const pending =
    query.trim().length >= SEARCH_MIN_CHARS &&
    (query.trim() !== debouncedQuery || search.query !== debouncedQuery);
  const status: Status = pending
    ? "loading"
    : !tooShort && search.query === debouncedQuery
      ? search.status
      : "idle";
  const results = status === "success" ? search.results : [];
  const showList = open && status !== "idle";

  function select(l: Localite) {
    setOpen(false);
    setQuery(l.name);
    router.push(`/meteo/${localiteSlug(l)}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") return setOpen(false);
    if (!showList || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[Math.max(active, 0)]);
    }
  }

  const statusMessage =
    status === "loading"
      ? "Recherche en cours…"
      : status === "error"
        ? "La recherche a échoué. Vérifiez votre connexion et réessayez."
        : status === "success" && results.length === 0
          ? "Aucune localité trouvée au Bénin."
          : status === "success"
            ? `${results.length} localité${results.length > 1 ? "s" : ""} trouvée${results.length > 1 ? "s" : ""}. Utilisez les flèches pour naviguer.`
            : "";

  return (
    <div className="relative w-full">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Rechercher une localité du Bénin
      </label>
      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted ${compact ? "size-4" : "size-5"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 && results[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder={compact ? "Rechercher…" : "Cotonou, Parakou, Ouidah…"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          className={`w-full rounded-lg border border-border-strong bg-surface text-foreground placeholder:text-muted transition-colors focus:border-foreground ${
            compact ? "h-10 pl-10 pr-4 text-sm" : "h-14 pl-12 pr-5 text-base"
          }`}
        />
      </div>

      {open && query.trim().length > 0 && query.trim().length < SEARCH_MIN_CHARS && !compact && (
        <p className="mt-2 text-sm text-muted">Tapez au moins {SEARCH_MIN_CHARS} caractères.</p>
      )}

      {/* Annonce aux lecteurs d'écran (4.1.3 Messages d'état) */}
      <p role="status" aria-live="polite" className="sr-only">
        {statusMessage}
      </p>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Localités trouvées"
          aria-busy={status === "loading"}
          className="absolute z-[1000] mt-1 max-h-80 w-full overflow-auto rounded-lg border border-border-strong bg-surface p-1 text-left shadow-md"
        >
          {status === "loading" ? (
            <SearchResultsSkeleton />
          ) : results.length === 0 ? (
            <li className={`px-4 py-3 text-sm ${status === "error" ? "text-alert" : "text-muted"}`}>
              {statusMessage}
            </li>
          ) : (
            results.map((l, i) => (
              <li
                key={l.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(l)}
                onMouseEnter={() => setActive(i)}
                className={`flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 ${
                  i === active ? "bg-subtle" : ""
                }`}
              >
                <span className="font-medium">{l.name}</span>
                <span className="text-right text-sm text-muted">
                  {[l.admin2, l.admin1].filter(Boolean).join(", ")}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
