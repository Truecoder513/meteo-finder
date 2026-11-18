// Message affiché quand une position ou une localité est hors du Bénin.
export function BeninOnlyNotice({ message }: { message?: string }) {
  return (
    <div role="alert" className="rounded-lg border border-border-strong px-4 py-3 text-sm">
      <p className="font-medium">Service disponible uniquement au Bénin.</p>
      <p className="mt-0.5 text-muted">
        {message ?? "Votre position semble se trouver hors du territoire béninois."}
      </p>
    </div>
  );
}
