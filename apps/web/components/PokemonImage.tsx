/**
 * Composant d'Image Pokémon avec Gestion d'Erreur
 * 
 * Ce composant encapsule le composant Image de Next.js avec une gestion
 * robuste des erreurs de chargement d'image.
 * 
 * Concepts clés pour les étudiants :
 * - Composant Image de Next.js pour l'optimisation des images
 * - Gestion des erreurs avec état local
 * - Fallback UI quand l'image n'est pas disponible
 * - Pattern de composition avec Omit<> pour les props
 */

"use client";

// Composant Image optimisé de Next.js
import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
// Icône pour l'état d'erreur
import { ImageOff } from "lucide-react";
// Utilitaire de fusion de classes
import { cn } from "@workspace/ui/lib/utils";

/**
 * Props du composant PokemonImage
 * Étend ImageProps mais rend src optionnel/nullable
 */
interface PokemonImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;  // L'URL peut être undefined ou null
}

/**
 * Composant PokemonImage - Image avec fallback en cas d'erreur
 * 
 * Affiche l'image du Pokémon si disponible, sinon un placeholder
 * avec une icône indiquant que l'image n'est pas disponible.
 * 
 * @param src - URL de l'image (peut être null/undefined)
 * @param alt - Texte alternatif pour l'accessibilité
 * @param className - Classes CSS additionnelles
 * @param ...props - Autres props passées à Next/Image
 */
export function PokemonImage({ src, alt, className, ...props }: PokemonImageProps) {
  // État pour tracker si l'image a échoué à charger
  const [error, setError] = useState(false);

  /**
   * Réinitialise l'état d'erreur quand l'URL change
   * Permet de retenter le chargement si une nouvelle URL est fournie
   */
  useEffect(() => {
    setError(false);
  }, [src]);

  // Affichage du fallback si erreur ou pas d'URL
  if (error || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/20 rounded-md", className)}>
        {/* Icône indiquant l'absence d'image */}
        <ImageOff className="text-muted-foreground/40 object-cover" />
        {/* Texte accessible pour les lecteurs d'écran */}
        <span className="sr-only">Image non disponible pour {alt}</span>
      </div>
    );
  }

  // Rendu normal avec le composant Image de Next.js
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      // Capture les erreurs de chargement
      onError={() => setError(true)}
      {...props}
    />
  );
}
