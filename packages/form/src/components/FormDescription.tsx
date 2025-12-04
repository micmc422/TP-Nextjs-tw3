/**
 * Composant FormDescription - Texte Descriptif pour les Champs de Formulaire
 * 
 * Ce composant affiche une description d'aide sous un champ de formulaire.
 * Il est automatiquement lié au champ via l'attribut aria-describedby,
 * permettant aux technologies d'assistance d'annoncer la description.
 * 
 * Concepts clés pour les étudiants :
 * - Accessibilité : la description est liée au champ via aria-describedby
 * - UX (User Experience) : aide l'utilisateur à comprendre ce qu'on attend
 * - Contexte React : utilise useFormField pour récupérer l'ID du champ
 * 
 * Bonnes pratiques :
 * - Utilisez des descriptions concises et utiles
 * - Indiquez le format attendu (ex: "Format: jj/mm/aaaa")
 * - Mentionnez les contraintes (ex: "Minimum 8 caractères")
 * 
 * @example
 * ```tsx
 * <FormField name="password">
 *   <FormLabel>Mot de passe</FormLabel>
 *   <FormControl>
 *     <Input type="password" />
 *   </FormControl>
 *   <FormDescription>
 *     Le mot de passe doit contenir au moins 8 caractères,
 *     une majuscule et un chiffre.
 *   </FormDescription>
 * </FormField>
 * ```
 */

"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

/**
 * Interface des props de FormDescription
 * Étend les attributs HTML du paragraphe pour permettre la personnalisation
 */
export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

/**
 * Composant FormDescription - Affiche une description pour le champ
 * 
 * Ce composant :
 * 1. Récupère l'ID du champ depuis le contexte
 * 2. Génère un ID unique pour la description
 * 3. Rend un paragraphe avec les attributs d'accessibilité
 * 
 * L'ID généré est utilisé par FormControl pour créer le lien
 * aria-describedby, permettant aux lecteurs d'écran d'annoncer
 * cette description quand l'utilisateur entre dans le champ.
 * 
 * @param children - Le texte de description à afficher
 * @param className - Classes CSS pour personnaliser le style
 */
function FormDescription({ children, className, ...props }: FormDescriptionProps) {
  // Récupère l'ID du champ parent pour créer l'ID de description
  const { id } = useFormField()
  const descriptionId = `${id}-description`

  return (
    <p
      id={descriptionId}
      data-slot="form-description"
      className={className}
      {...props}
    >
      {children}
    </p>
  )
}

export { FormDescription }
