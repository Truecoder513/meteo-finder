import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getForecastCached } from "@/app/services/cached";
import { BeninOnlyNotice } from "@/components/BeninOnlyNotice";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { MapView } from "@/components/map/MapView";
import { isInBeninBounds } from "@/lib/benin";
import { WeatherPageSkeleton } from "@/components/skeletons/WeatherSkeletons";

export const metadata: Metadata = {
  title: "Météo à votre position",
  // Page propre à chaque visiteur : pas d'indexation.
  robots: { index: false, follow: true },
};

function parseCoord(value: string | string[] | undefined): number | null {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return value !== undefined && Number.isFinite(n) ? n : null;
}

async function PositionWeather({ searchParams }: Pick<PageProps<"/meteo/position">, "searchParams">) {
  const sp = await searchParams;
  const latitude = parseCoord(sp.lat);
  const longitude = parseCoord(sp.lon);

  if (latitude === null || longitude === null || !isInBeninBounds(latitude, longitude)) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-10">
        <h1 className="text-2xl font-semibold">Position hors du Bénin</h1>
        <BeninOnlyNotice message="Les coordonnées reçues ne se trouvent pas au Bénin." />
        <Link href="/" className="inline-flex min-h-11 items-center text-brand-strong underline underline-offset-2">
          Rechercher une localité
        </Link>
      </div>
    );
  }

  // Arrondi à ~1 km : protège la vie privée et mutualise le cache.
  const lat = Math.round(latitude * 100) / 100;
  const lon = Math.round(longitude * 100) / 100;
  const forecast = await getForecastCached(lat, lon);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Météo à votre position</h1>
      <p className="mt-1 text-muted">Bénin</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <CurrentWeather current={forecast.current} />
        <MapView name="Votre position" latitude={lat} longitude={lon} />
      </div>

      <div className="mt-12">
        <DailyForecast daily={forecast.daily} />
      </div>
    </>
  );
}

export default function PositionPage({ searchParams }: PageProps<"/meteo/position">) {
  return (
    <Suspense fallback={<WeatherPageSkeleton label="Chargement de la météo à votre position…" />}>
      <PositionWeather searchParams={searchParams} />
    </Suspense>
  );
}
