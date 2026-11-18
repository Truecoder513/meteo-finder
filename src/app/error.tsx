"use client"; // Les error boundaries sont des Client Components

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";
import { Header } from "@/components/Header";

export default function RootError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 outline-none">
        <ErrorState
          title="Une erreur est survenue"
          message="La page n’a pas pu s’afficher. Vérifiez votre connexion puis réessayez."
          onRetry={retry}
        />
      </main>
    </>
  );
}
