"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
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

export function NavigationMain() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-3xl w-full px-4 mx-auto py-3">
        {/* Mobile Navigation */}
        <div className="flex items-center justify-between md:hidden">
          <Link href="/" className="font-semibold text-lg">
            Next.js TP
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-2">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Accueil
            </Link>
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
          </nav>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
                  Accueil
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Poké</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
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

              <NavigationMenuItem>
                <NavigationMenuLink href="/packages" className={navigationMenuTriggerStyle()}>
                  Packages
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}

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
