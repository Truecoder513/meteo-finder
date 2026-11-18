"use client"; // Dernier recours : erreur dans le layout racine lui-même.

import "./globals.css";

export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center px-4 font-sans">
        <title>Erreur | Météo Bénin</title>
        <main role="alert" className="max-w-md rounded-lg border border-alert p-6">
          <h1 className="text-lg font-semibold">Une erreur est survenue</h1>
          <p className="mt-1 text-sm text-muted">
            Le site n’a pas pu s’afficher. Vérifiez votre connexion puis réessayez.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-white hover:bg-foreground/85"
          >
            Réessayer
          </button>
        </main>
      </body>
    </html>
  );
}
