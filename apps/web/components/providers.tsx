"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { CompareProvider } from "./PokemonCompareContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <CompareProvider>
        {children}
      </CompareProvider>
    </NextThemesProvider>
  )
}
