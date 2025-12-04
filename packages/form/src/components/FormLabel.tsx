/**
 * Composant FormLabel - Étiquette Accessible pour les Champs de Formulaire
 * 
 * Ce composant affiche une étiquette (<label>) pour un champ de formulaire.
 * Il est automatiquement lié au champ via l'attribut htmlFor, ce qui améliore
 * l'accessibilité et l'ergonomie (cliquer sur le label focus le champ).
 * 
 * Concepts clés pour les étudiants :
 * - Accessibilité : htmlFor lie le label à l'input correspondant
 * - UX : cliquer sur le label active le champ associé
 * - État visuel : data-error permet de styliser différemment en cas d'erreur
 * - Sémantique HTML : utilise la balise <label> native
 * 
 * Bonnes pratiques :
 * - Chaque champ doit avoir un label visible
 * - Le texte du label doit être clair et concis
 * - Indiquez visuellement les champs obligatoires (ex: *)
 * 
 * @example
 * ```tsx
 * <FormField name="name">
 *   <FormLabel>Nom complet *</FormLabel>
 *   <FormControl>
 *     <Input placeholder="Jean Dupont" />
 *   </FormControl>
 * </FormField>
 * ```
 */

"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

/**
 * Interface des props de FormLabel
 * Étend les attributs HTML du label pour permettre la personnalisation complète
 */
export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

/**
 * Composant FormLabel - Étiquette liée automatiquement au champ
 * 
 * Ce composant :
 * 1. Récupère l'ID et l'état du champ depuis le contexte
 * 2. Crée un label avec htmlFor pointant vers l'input
 * 3. Ajoute data-error pour permettre le style conditionnel
 * 
 * L'attribut data-error peut être utilisé dans CSS :
 * ```css
 * [data-error="true"] { color: red; }
 * ```
 * 
 * Ou avec Tailwind :
 * ```tsx
 * className="data-[error=true]:text-destructive"
 * ```
 * 
 * @param children - Le texte de l'étiquette
 * @param className - Classes CSS pour personnaliser le style
 */
function FormLabel({ children, className, ...props }: FormLabelProps) {
  // Récupère l'ID du champ et son état d'erreur
  const { id, fieldState } = useFormField()

  return (
    <label
      htmlFor={id}
      data-slot="form-label"
      data-error={fieldState.error ? "true" : undefined}
      className={className}
      {...props}
    >
      {children}
    </label>
  )
}

export { FormLabel }
