/**
 * Composant Navigation Principale de l'Application
 * 
 * Ce composant implémente une navigation responsive avec un menu desktop
 * et un menu mobile hamburger. Il utilise les composants shadcn/ui.
 * 
 * Concepts clés pour les étudiants :
 * - Navigation responsive (mobile vs desktop)
 * - Composant client ("use client") pour l'interactivité
 * - Utilisation de shadcn/ui NavigationMenu
 * - Pattern React.forwardRef pour les composants réutilisables
 */

"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
// Icônes pour le menu hamburger
import { Menu, X } from "lucide-react"
// Utilitaire de fusion de classes
import { cn } from "@workspace/ui/lib/utils"
// Composants UI du monorepo
import { Button } from "@workspace/ui/components/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu"

/**
 * Composant NavigationMain - Barre de navigation principale
 * 
 * Gère deux modes d'affichage :
 * 1. Mobile : Menu hamburger avec dropdown vertical
 * 2. Desktop : NavigationMenu horizontal avec sous-menus
 */
export function NavigationMain() {
  // État pour le menu mobile (ouvert/fermé)
  const [isOpen, setIsOpen] = useState(false)

  return (
    // Header sticky qui reste visible lors du scroll
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl w-full px-4 mx-auto py-3">
        {/* ===== NAVIGATION MOBILE ===== */}
        <div className="flex items-center justify-between md:hidden">
          {/* Logo/Titre cliquable */}
          <Link href="/" className="font-semibold text-lg">
            Next.js TP
          </Link>
          {/* Bouton hamburger avec accessibilité */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Menu déroulant mobile (affiché conditionnellement) */}
        {isOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
            {/* Sous-menu Pokémon */}
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Poké</p>
              <div className="pl-3 space-y-1 border-l-2 border-muted">
                <Link
                  href="/pokemon"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Pokédex
                </Link>
                <Link
                  href="/pokemon/compare"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Comparateur
                </Link>
                <Link
                  href="/pokemon/berry"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Baies
                </Link>
                <Link
                  href="/pokemon/move"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Capacités
                </Link>
                <Link
                  href="/pokemon/ability"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Talents
                </Link>
                <Link
                  href="/pokemon/create"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Créateur
                </Link>
              </div>
            </div>
            <Link
              href="/packages"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Packages
            </Link>
            {/* Sous-menu Utilisateurs */}
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Utilisateurs</p>
              <div className="pl-3 space-y-1 border-l-2 border-muted">
                <Link
                  href="/utilisateur"
                  className="block py-1.5 text-sm hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Liste des utilisateurs
                </Link>
              </div>
            </div>
          </nav>
        )}

        {/* ===== NAVIGATION DESKTOP ===== */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Lien Accueil */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Accueil
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Menu déroulant Pokémon */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Poké</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    {/* Carte principale Pokédex */}
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/pokemon"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Pokédex
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explorez le monde des Pokémon via notre API intégrée.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    {/* Liens secondaires */}
                    <ListItem href="/pokemon/compare" title="Comparateur">
                      Comparez les statistiques de différents Pokémon.
                    </ListItem>
                    <ListItem href="/pokemon/berry" title="Baies">
                      Découvrez les différentes baies, leurs saveurs et fermetés.
                    </ListItem>
                    <ListItem href="/pokemon/move" title="Capacités">
                      Explorez toutes les capacités et leurs effets.
                    </ListItem>
                    <ListItem href="/pokemon/ability" title="Talents">
                      Découvrez les talents et les Pokémon qui les possèdent.
                    </ListItem>
                    <ListItem href="/pokemon/create" title="Créateur">
                      Inventez votre propre Pokémon et générez un PDF.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Lien Packages */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/packages" className={navigationMenuTriggerStyle()}>
                  Packages
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Menu déroulant Utilisateurs */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Utilisateurs</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/utilisateur"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Liste des utilisateurs
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Consultez et gérez les utilisateurs enregistrés dans l'application.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}

/**
 * Composant ListItem - Élément de liste pour le menu de navigation
 * 
 * Utilise React.forwardRef pour permettre l'accès à la ref du DOM.
 * C'est une bonne pratique pour les composants réutilisables.
 * 
 * @param title - Titre du lien
 * @param children - Description du lien
 * @param className - Classes CSS additionnelles
 */
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
