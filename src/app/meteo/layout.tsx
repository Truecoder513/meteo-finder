import { Header } from "@/components/Header";

export default function MeteoLayout({ children }: LayoutProps<"/meteo">) {
  return (
    <>
      <Header withSearch />
      <main id="contenu" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 outline-none">
        {children}
      </main>
    </>
  );
}
