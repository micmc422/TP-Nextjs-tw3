/**
 * Composant FormControl - Contrôle de Formulaire avec Accessibilité
 * 
 * Ce composant encapsule les éléments de formulaire (input, textarea, select)
 * et leur ajoute automatiquement les attributs d'accessibilité nécessaires.
 * 
 * Concepts clés pour les étudiants :
 * - ARIA (Accessible Rich Internet Applications) : standard d'accessibilité web
 * - aria-describedby : lie le champ à sa description et ses messages d'erreur
 * - aria-invalid : indique aux technologies d'assistance qu'un champ est invalide
 * - React.cloneElement : permet de modifier les props d'un élément enfant
 * 
 * Fonctionnement :
 * 1. Récupère le contexte du champ via useFormField (id, état, nom)
 * 2. Clone l'élément enfant en ajoutant les attributs d'accessibilité
 * 3. Les lecteurs d'écran peuvent ainsi annoncer les erreurs et descriptions
 * 
 * @example
 * ```tsx
 * <FormField name="email">
 *   <FormLabel>Email</FormLabel>
 *   <FormControl>
 *     <Input type="email" placeholder="votre@email.com" />
 *   </FormControl>
 *   <FormMessage />
 * </FormField>
 * ```
 */

"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

/**
 * Interface des props de FormControl
 * 
 * @param children - L'élément de formulaire à envelopper (doit être un seul élément React)
 * @param className - Classes CSS optionnelles pour le conteneur
 */
export interface FormControlProps {
  children: React.ReactElement
  className?: string
}

/**
 * Composant FormControl - Ajoute l'accessibilité aux champs de formulaire
 * 
 * Ce composant :
 * 1. Récupère l'état du champ depuis le contexte (erreur, id, nom)
 * 2. Calcule les IDs pour la description et le message d'erreur
 * 3. Clone l'élément enfant en injectant les attributs nécessaires
 * 
 * Les attributs injectés :
 * - id : identifiant unique pour le <label htmlFor="">
 * - name : nom du champ pour la soumission du formulaire
 * - aria-describedby : référence vers les descriptions et messages
 * - aria-invalid : true si le champ contient une erreur
 * 
 * @param children - L'élément de formulaire à enrichir
 * @param className - Classes CSS additionnelles
 */
function FormControl({ children, className }: FormControlProps) {
  // Récupération du contexte du champ parent
  const { id, fieldState, name } = useFormField()
  
  // Construction des IDs pour les éléments liés
  const descriptionId = `${id}-description`
  const messageId = `${id}-message`

  // Clone l'élément enfant unique avec les attributs d'accessibilité
  const child = React.Children.only(children)
  
  return (
    <div className={className} data-slot="form-control">
      {React.cloneElement(child, {
        id,
        name,
        // Lie le champ à sa description et au message d'erreur si présent
        "aria-describedby": fieldState.error
          ? `${descriptionId} ${messageId}`
          : descriptionId,
        // Marque le champ comme invalide pour les technologies d'assistance
        "aria-invalid": fieldState.error ? true : undefined,
        // Préserve les props existantes de l'enfant
        ...child.props,
      })}
    </div>
  )
}

export { FormControl }
