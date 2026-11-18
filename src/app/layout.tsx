import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { serverEnv } from "@/lib/env.server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.siteUrl),
  title: {
    default: "Météo Bénin — météo et prévisions de toutes les localités",
    template: "%s | Météo Bénin",
  },
  description:
    "Météo actuelle et prévisions sur 7 jours pour Cotonou, Porto-Novo, Parakou et toutes les localités du Bénin.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Lien d'évitement (2.4.1) */}
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:border focus:border-border-strong focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Aller au contenu
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
