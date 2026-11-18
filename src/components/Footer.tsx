const link = "underline underline-offset-2 hover:text-foreground";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>Météo Bénin</p>
        <p>
          Données{" "}
          <a href="https://open-meteo.com/" className={link}>
            Open-Meteo
          </a>{" "}
          · Carte ©{" "}
          <a href="https://www.openstreetmap.org/copyright" className={link}>
            OpenStreetMap
          </a>
        </p>
      </div>
    </footer>
  );
}
