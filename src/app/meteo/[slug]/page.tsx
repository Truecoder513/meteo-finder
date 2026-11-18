import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getForecastCached, getLocaliteCached } from "@/app/services/cached";
import { CurrentWeather } from "@/components/CurrentWeather";
import { DailyForecast } from "@/components/DailyForecast";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { MapView } from "@/components/map/MapView";
import { GRANDES_VILLES } from "@/lib/benin";
import { idFromSlug, localiteSlug } from "@/lib/slug";

// Grandes villes pré-rendues au build (SEO) ; les autres localités sont rendues à la demande.
export function generateStaticParams() {
  return GRANDES_VILLES.map((l) => ({ slug: localiteSlug(l) }));
}

async function loadLocalite(slug: string) {
  const id = idFromSlug(slug);
  return id ? getLocaliteCached(id) : null;
}

export async function generateMetadata({ params }: PageProps<"/meteo/[slug]">): Promise<Metadata> {
  const localite = await loadLocalite((await params).slug);
  if (!localite) return { title: "Localité introuvable" };
  const lieu = [localite.admin2, localite.admin1].filter(Boolean).join(", ");
  return {
    title: `Météo ${localite.name} — prévisions 7 jours`,
    description: `Météo actuelle et prévisions sur 7 jours à ${localite.name}${lieu ? ` (${lieu})` : ""}, Bénin : température, pluie, vent et humidité.`,
    alternates: { canonical: `/meteo/${localiteSlug(localite)}` },
  };
}

export default async function LocalitePage({ params }: PageProps<"/meteo/[slug]">) {
  const localite = await loadLocalite((await params).slug);
  if (!localite) notFound();

  const forecast = await getForecastCached(localite.latitude, localite.longitude);

  return (
    <>
      <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="underline-offset-2 hover:text-brand-strong hover:underline">
              Accueil
            </Link>
          </li>
          {localite.admin1 && (
            <>
              <li aria-hidden>/</li>
              <li>{localite.admin1}</li>
            </>
          )}
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-foreground">
            {localite.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Météo à {localite.name}</h1>
          <p className="mt-1 text-muted">
            {[localite.admin2, localite.admin1, "Bénin"].filter(Boolean).join(", ")}
          </p>
        </div>
        <FavoriteButton
          localite={{
            id: localite.id,
            name: localite.name,
            admin1: localite.admin1,
            admin2: localite.admin2,
            latitude: localite.latitude,
            longitude: localite.longitude,
          }}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[3fr_2fr]">
        <CurrentWeather current={forecast.current} />
        <MapView name={localite.name} latitude={localite.latitude} longitude={localite.longitude} />
      </div>

      <div className="mt-12">
        <DailyForecast daily={forecast.daily} />
      </div>
    </>
  );
}
