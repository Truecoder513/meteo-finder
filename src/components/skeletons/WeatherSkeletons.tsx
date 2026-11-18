import { Skeleton } from "./Skeleton";

/** Lignes de résultats de la recherche pendant le fetch. */
export function SearchResultsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} aria-hidden className="flex min-h-11 items-center justify-between gap-3 px-3 py-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </li>
      ))}
    </>
  );
}

/** Bloc « Maintenant » : même gabarit que CurrentWeather. */
export function CurrentWeatherSkeleton() {
  return (
    <div aria-hidden className="flex flex-col rounded-xl border border-border p-6 sm:p-8">
      <Skeleton className="h-4 w-32" />
      <div className="mt-4 flex items-center gap-5">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-5 lg:mt-auto">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Zone de carte (tuiles OpenStreetMap en cours de chargement). */
export function MapSkeleton() {
  return <span aria-hidden className="block size-full animate-pulse bg-skeleton" />;
}

/** Carte complète avec son pied (coordonnées + lien). */
export function MapSectionSkeleton() {
  return (
    <div aria-hidden className="flex flex-col overflow-hidden rounded-xl border border-border">
      <div className="aspect-4/3 w-full lg:aspect-auto lg:min-h-80 lg:flex-1">
        <MapSkeleton />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

/** Liste « Prévisions sur 7 jours ». */
export function DailyForecastSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton className="mb-3 h-6 w-48" />
      <ul className="border-t border-border">
        {Array.from({ length: 7 }, (_, i) => (
          <li
            key={i}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border py-4 sm:grid-cols-[10rem_2rem_6rem_1fr]"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="col-span-3 h-1.5 sm:col-span-1" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Page météo complète (localité ou position). */
export function WeatherPageSkeleton({ label = "Chargement de la météo…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div aria-hidden>
        <Skeleton className="mb-6 h-4 w-48" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-32" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
          <CurrentWeatherSkeleton />
          <MapSectionSkeleton />
        </div>
        <div className="mt-12">
          <DailyForecastSkeleton />
        </div>
      </div>
    </div>
  );
}
