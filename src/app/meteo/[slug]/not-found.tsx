import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20">
      <p className="text-sm text-muted">Erreur 404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">Localité introuvable</h1>
      <p className="mt-2 text-muted">
        Cette localité n’existe pas ou ne se trouve pas au Bénin. Ce service couvre
        uniquement le territoire béninois.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-white hover:bg-foreground/85"
      >
        Retour à la recherche
      </Link>
    </div>
  );
}
