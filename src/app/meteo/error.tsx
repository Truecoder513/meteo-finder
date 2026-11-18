"use client"; // Les error boundaries sont des Client Components

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

// Couvre les pages localité et « ma position » : API injoignable, réponse en erreur, délai dépassé…
// L'en-tête (avec la recherche) reste affiché grâce au layout parent.
export default function MeteoError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error); // journalisation seulement, jamais affichée à l'utilisateur
  }, [error]);

  return <ErrorState onRetry={retry} withHomeLink />;
}
