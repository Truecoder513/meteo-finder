import { CityCard } from "@/components/CityCard";
import { FavoritesList } from "@/components/favorites/FavoritesList";
import { GeolocateButton } from "@/components/GeolocateButton";
import { Header } from "@/components/Header";
import { SearchBox } from "@/components/SearchBox";
import { GRANDES_VILLES } from "@/lib/benin";

export default function Home() {
  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 outline-none">
        <section className="mx-auto max-w-xl py-16 sm:py-24" aria-labelledby="hero-title">
          <h1 id="hero-title" className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            La météo des localités du Bénin
          </h1>
          <p className="mt-3 text-muted text-pretty">
            Météo actuelle et prévisions sur 7 jours pour les communes, villes et villages du Bénin.
          </p>

          <div className="mt-8 space-y-3">
            <SearchBox />
            <GeolocateButton />
          </div>
        </section>

        <FavoritesList />

        <section aria-labelledby="villes-title" className="pb-20">
          <h2 id="villes-title" className="mb-2 text-sm font-medium text-muted">
            Grandes villes
          </h2>
          <ul className="grid grid-cols-1 gap-x-8 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {GRANDES_VILLES.map((l) => (
              <li key={l.id}>
                <CityCard localite={l} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
