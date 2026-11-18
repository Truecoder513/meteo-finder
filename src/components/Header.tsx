import Link from "next/link";
import { StarIcon } from "./favorites/StarIcon";
import { SearchBox } from "./SearchBox";

export function Header({ withSearch = false }: { withSearch?: boolean }) {
  return (
    <header className="sticky top-0 z-[1100] border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:gap-6">
        <Link
          href="/"
          aria-label="Météo Bénin — accueil"
          className="flex min-h-11 shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          Météo Bénin
        </Link>
        <nav aria-label="Principale" className={withSearch ? "" : "ml-auto"}>
          <Link
            href="/#favoris"
            className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2 text-sm text-muted hover:bg-subtle hover:text-foreground"
          >
            <StarIcon className="size-4" />
            {/* Texte visible dès 640 px ; toujours lu par les lecteurs d'écran */}
            <span className="sr-only sm:not-sr-only">Favoris</span>
          </Link>
        </nav>
        {withSearch && (
          <div className="ml-auto w-full max-w-xs">
            <SearchBox compact />
          </div>
        )}
      </div>
    </header>
  );
}
