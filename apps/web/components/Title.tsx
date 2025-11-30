// components/Title.tsx
import React from 'react';
import { cn } from '@workspace/ui/lib/utils'; // Assurez-vous d'avoir la fonction cn (classnames utility) de shadcn/ui
/**
 * Définit les niveaux de titre et leurs styles Tailwind associés.
 * Ces styles sont basés sur les conventions typographiques courantes.
 */
const titleStyles = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
    homepage: 'scroll-m-20 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-center leading-none',
} as const; // 'as const' pour TypeScript pour des types stricts

type TitleLevel = keyof typeof titleStyles;

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    /**
     * Le niveau de titre à afficher. 'homepage' applique un style massif.
     */
    level: TitleLevel;
    /**
     * Le contenu du titre.
     */
    children: React.ReactNode;
}

const tagMap: Record<TitleLevel, 'h1' | 'h2' | 'h3' | 'h4'> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    homepage: 'h1', // Le titre de la page d'accueil est généralement un h1 sémantique
};

/**
 * Composant de titre général pour H1 à H4 et un style 'homepage' massif.
 * Il gère les styles Tailwind et la balise sémantique correcte.
 *
 * @param {TitleProps} props - Les propriétés du composant.
 */
export function Title({ level, children, className, ...props }: TitleProps) {
    // Récupère la balise HTML sémantique appropriée (h1, h2, h3, ou h4)
    const Tag = tagMap[level];

    // Récupère les styles Tailwind par défaut pour le niveau spécifié
    const defaultStyle = titleStyles[level];

    // Combine les styles par défaut avec les classes personnalisées de l'utilisateur
    // en utilisant l'utilitaire cn de shadcn/ui
    return (
        <Tag
            className={cn(defaultStyle, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}