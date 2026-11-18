// Bloc de squelette de base. Purement décoratif : l'annonce aux lecteurs
// d'écran est faite par le conteneur parent (role="status").
// L'animation est coupée si l'utilisateur préfère réduire les mouvements (globals.css).
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulse rounded bg-skeleton ${className}`} />;
}
