import Link from "next/link";
import { localiteSlug } from "@/lib/slug";
import type { Localite } from "@/types/open-meteo";

export function CityCard({ localite }: { localite: Pick<Localite, "id" | "name" | "admin1"> }) {
  return (
    <Link
      href={`/meteo/${localiteSlug(localite)}`}
      className="group flex min-h-14 items-center justify-between gap-3 border-b border-border px-1 py-3 transition-colors hover:bg-subtle"
    >
      <span>
        <span className="block font-medium">{localite.name}</span>
        <span className="block text-sm text-muted">{localite.admin1}</span>
      </span>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-4 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <path d="m9 6 6 6-6 6" />
      </svg>
    </Link>
  );
}
