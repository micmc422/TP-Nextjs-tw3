// components/Text.tsx
import React from 'react';
import { cn } from '@workspace/ui/lib/utils'; // Assurez-vous d'avoir la fonction cn

/**
 * Définit les variations de taille et leurs classes Tailwind associées.
 * Les classes incluent la taille de la police (text-*) et la hauteur de ligne (leading-*).
 */
const textSizeMap = {
    xs: 'text-xs leading-none', // Extra-small (e.g., copyright/metadata)
    sm: 'text-sm leading-snug', // Small (e.g., descriptions fines, petites notes)
    base: 'text-base leading-relaxed', // Standard/paragraphe par défaut
    lg: 'text-lg leading-relaxed', // Large (e.g., pour un corps de texte plus lisible)
    xl: 'text-xl leading-relaxed', // Extra-large (e.g., intro accrocheuse)
    lead: 'text-xl text-muted-foreground leading-7 [&:not(:first-child)]:mt-6', // Variation 'lead' de shadcn/ui
} as const;

type TextSize = keyof typeof textSizeMap;

interface TextProps extends React.HTMLAttributes<HTMLElement> {
    /**
     * Le contenu du paragraphe.
     */
    children: React.ReactNode;
    /**
     * Style spécial pour la citation en bloc.
     * Si 'true', le texte est rendu dans une balise <blockquote>.
     */
    blockquote?: boolean;
    /**
     * La taille du texte. 'base' est la taille par défaut.
     */
    size?: TextSize;
}

/**
 * Composant pour gérer les styles de paragraphe, blockquote, et différentes tailles de texte.
 */
export function Text({ children, className, blockquote = false, size = 'base', ...props }: TextProps) {

    // 1. Styles spécifiques pour le blockquote
    if (blockquote) {
        return (
            <blockquote
                // Applique des styles blockquote de shadcn/ui
                className={cn(
                    "mt-6 border-l-2 pl-6 italic text-gray-700 dark:text-gray-300",
                    className
                )}
                {...props}
            >
                {children}
            </blockquote>
        );
    }

    // 2. Rendu pour un paragraphe standard

    // Récupère les styles de taille en fonction de la prop 'size'
    const sizeStyle = textSizeMap[size];

    // Style par défaut pour le paragraphe (s'assure d'une marge cohérente)
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