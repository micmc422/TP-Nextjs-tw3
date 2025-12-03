/**
 * Composant Text - Paragraphes et Citations Stylisés
 * 
 * Ce composant gère les styles de texte pour les paragraphes et les
 * citations (blockquote), avec différentes tailles prédéfinies.
 * 
 * Concepts clés pour les étudiants :
 * - Composant polymorphique (rend <p> ou <blockquote>)
 * - Pattern de variantes avec un objet de mapping
 * - Props optionnelles avec valeurs par défaut
 * - Styles responsifs avec Tailwind CSS
 */

import React from 'react';
// Utilitaire de fusion de classes CSS
import { cn } from '@workspace/ui/lib/utils';

/**
 * Mapping des tailles de texte vers les classes Tailwind
 * 
 * Chaque taille inclut :
 * - text-* : taille de la police
 * - leading-* : hauteur de ligne (interligne)
 */
const textSizeMap = {
    xs: 'text-xs leading-none',       // Extra-small (copyright, métadonnées)
    sm: 'text-sm leading-snug',       // Small (descriptions, notes)
    base: 'text-base leading-relaxed', // Taille par défaut (paragraphes)
    lg: 'text-lg leading-relaxed',     // Large (texte mis en avant)
    xl: 'text-xl leading-relaxed',     // Extra-large (introductions)
    lead: 'text-xl text-muted-foreground leading-7 [&:not(:first-child)]:mt-6', // Style "lead" shadcn/ui
} as const;

/**
 * Type des tailles disponibles (inféré depuis textSizeMap)
 */
type TextSize = keyof typeof textSizeMap;

/**
 * Props du composant Text
 */
interface TextProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Contenu du paragraphe ou de la citation
     */
    children: React.ReactNode;
    /**
     * Si true, le texte est rendu dans une balise <blockquote>
     * avec un style de citation (bordure gauche, italique)
     */
    blockquote?: boolean;
    /**
     * Taille du texte. Par défaut : 'base'
     */
    size?: TextSize;
}

/**
 * Composant Text - Texte avec styles prédéfinis
 * 
 * @example
 * // Paragraphe standard
 * <Text>Contenu du paragraphe.</Text>
 * 
 * @example
 * // Texte large pour une introduction
 * <Text size="lg">Bienvenue dans notre application.</Text>
 * 
 * @example
 * // Citation en bloc
 * <Text blockquote>
 *   "Attrapez-les tous !" - Pokémon
 * </Text>
 * 
 * @param children - Contenu textuel
 * @param className - Classes CSS additionnelles
 * @param blockquote - Si true, rend une <blockquote>
 * @param size - Taille du texte (xs, sm, base, lg, xl, lead)
 */
export function Text({ children, className, blockquote = false, size = 'base', ...props }: TextProps) {

    // Mode citation : rendu en <blockquote> avec style spécifique
    if (blockquote) {
        return (
            <blockquote
                className={cn(
                    // Styles blockquote inspirés de shadcn/ui
                    "mt-6 border-l-2 pl-6 italic text-gray-700 dark:text-gray-300",
                    className
                )}
                {...props}
            >
                {children}
            </blockquote>
        );
    }

    // Mode paragraphe standard
    // Récupère les styles de taille correspondants
    const sizeStyle = textSizeMap[size];

    // Style de base pour les paragraphes (marge entre les paragraphes consécutifs)
    // [&:not(:first-child)]:mt-6 ajoute une marge-top sauf pour le premier enfant
    const paragraphBaseStyle = '[&:not(:first-child)]:mt-6';

    return (
        <p
            className={cn(paragraphBaseStyle, sizeStyle, className)}
            {...props}
        >
            {children}
        </p>
    );
}