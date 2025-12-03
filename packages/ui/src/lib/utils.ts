/**
 * Fonction Utilitaire pour la Fusion de Classes CSS
 * 
 * Cette fonction combine clsx et tailwind-merge pour gérer intelligemment
 * les classes CSS, notamment avec Tailwind CSS.
 * 
 * Concepts clés pour les étudiants :
 * - clsx : concatène conditionnellement des classes CSS
 * - tailwind-merge : résout les conflits entre classes Tailwind
 * - Exemple de conflit : "px-4 px-2" → tailwind-merge garde "px-2"
 * 
 * Utilisation typique :
 * cn("base-class", condition && "conditional-class", className)
 * 
 * Cette pattern est standard dans les projets utilisant shadcn/ui.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combine et fusionne les classes CSS de manière intelligente
 * 
 * @param inputs - Classes CSS à combiner (strings, objets, tableaux, etc.)
 * @returns Chaîne de classes CSS optimisée
 * 
 * @example
 * // Classe conditionnelle
 * cn("px-4", isActive && "bg-blue-500")
 * 
 * @example
 * // Résolution de conflit Tailwind
 * cn("px-4", "px-2") // Retourne "px-2"
 * 
 * @example
 * // Avec className prop
 * cn("base-styles", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
