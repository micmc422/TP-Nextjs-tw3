import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"
import { NavigationMain } from "@/components/NavigationMain"

export const metadata: Metadata = {
  title: {
    default: "Next.js Avancé | Monorepo TP",
    template: "%s | Next.js Avancé",
  },
  description: "Application Next.js avancée avec configuration monorepo et composants réutilisables. Découvrez les bonnes pratiques du développement moderne.",
  keywords: ["Next.js", "React", "Monorepo", "Turborepo", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "TP Next.js" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Next.js Avancé",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <NavigationMain />
          {children}
          </Providers>
      </body>
    </html>
  )
}
