"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry: () => void;
  /** Affiche un lien de retour à l'accueil */
  withHomeLink?: boolean;
  compact?: boolean;
};

/**
 * Message d'erreur compréhensible + bouton « Réessayer ».
 * Ne montre jamais le détail technique de l'erreur.
 */
export function ErrorState({
  title = "Météo indisponible pour le moment",
  message = "Le service météo ne répond pas ou votre connexion est interrompue. Vérifiez votre connexion puis réessayez.",
  onRetry,
  withHomeLink = false,
  compact = false,
}: ErrorStateProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Le focus va sur le message pour que les utilisateurs clavier / lecteur d'écran le trouvent.
  useEffect(() => {
    if (!compact) ref.current?.focus();
  }, [compact]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className={`rounded-lg border border-alert outline-none ${compact ? "p-4" : "mx-auto max-w-md p-6 my-12"}`}
    >
      <div className="flex items-start gap-3">
        <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-alert" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
        <div>
          <p className={`font-semibold ${compact ? "text-sm" : "text-lg"}`}>{title}</p>
          <p className="mt-1 text-sm text-muted">{message}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-4 text-sm font-medium text-white hover:bg-foreground/85"
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Réessayer
            </button>
            {withHomeLink && (
              <Link href="/" className="inline-flex min-h-11 items-center text-sm underline underline-offset-2">
                Retour à l’accueil
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
