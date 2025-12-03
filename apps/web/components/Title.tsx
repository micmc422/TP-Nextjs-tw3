/**
 * Composant Title - Titres Typographiques Stylisés
 * 
 * Ce composant fournit des styles de titre cohérents basés sur les
 * conventions typographiques de shadcn/ui.
 * 
 * Concepts clés pour les étudiants :
 * - Composant de présentation (presentational component)
 * - Mapping de styles via un objet de configuration
 * - Rendu conditionnel de la balise HTML sémantique
 * - Utilisation de cn() pour la fusion de classes
 * - "as const" pour un typage strict des niveaux
 */

import React from 'react';
// Utilitaire de fusion de classes CSS (clsx + tailwind-merge)
import { cn } from '@workspace/ui/lib/utils';

/**
 * Styles Tailwind pour chaque niveau de titre
 * 
 * - scroll-m-20 : marge de défilement pour les ancres
 * - tracking-tight : espacement des lettres serré
 * - font-extrabold/semibold : poids de la police
 * - Responsive : text-xl sm:text-2xl etc.
 */
const titleStyles = {
    h1: 'scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 border-b pb-2 text-2xl sm:text-3xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-xl sm:text-2xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-lg sm:text-xl font-semibold tracking-tight',
    homepage: 'scroll-m-20 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-center leading-none',
} as const; // "as const" pour un type littéral strict

/**
 * Type des niveaux de titre disponibles
 * Inféré depuis les clés de titleStyles
 */
type TitleLevel = keyof typeof titleStyles;

/**
 * Props du composant Title
 */
interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    /**
     * Niveau de titre à afficher
     * - h1, h2, h3, h4 : titres standards
     * - homepage : style massif pour la page d'accueil
     */
    level: TitleLevel;
    /**
     * Contenu du titre
     */
    children: React.ReactNode;
}

/**
 * Mapping niveau → balise HTML sémantique
 * "homepage" utilise h1 pour la sémantique mais avec un style différent
 */
const tagMap: Record<TitleLevel, 'h1' | 'h2' | 'h3' | 'h4'> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    homepage: 'h1', // Le titre de la page d'accueil est sémantiquement un h1
};

/**
 * Composant Title - Titre avec styles prédéfinis et balise sémantique
 * 
 * @example
 * <Title level="h1">Titre Principal</Title>
 * <Title level="h2" className="text-primary">Sous-titre</Title>
 * <Title level="homepage">Next.js Avancé</Title>
 * 
 * @param level - Niveau de titre (h1, h2, h3, h4, homepage)
 * @param children - Contenu du titre
 * @param className - Classes CSS additionnelles (fusionnées avec les styles par défaut)
 */
export function Title({ level, children, className, ...props }: TitleProps) {
    // Récupère la balise HTML appropriée (h1, h2, h3, ou h4)
    const Tag = tagMap[level];

    // Récupère les styles Tailwind pour le niveau demandé
    const defaultStyle = titleStyles[level];

    // Combine les styles par défaut avec les classes personnalisées
    // cn() gère les conflits de classes Tailwind intelligemment
    return (
        <Tag
            className={cn(defaultStyle, className)}
            {...props}
        >
            {children}
        </Tag>
    );
}