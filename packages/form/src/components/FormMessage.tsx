/**
 * Composant FormMessage - Affichage des Messages d'Erreur de Validation
 * 
 * Ce composant affiche les messages d'erreur de validation pour un champ.
 * Il récupère automatiquement l'erreur depuis le contexte du champ et
 * l'affiche de manière accessible pour les lecteurs d'écran.
 * 
 * Concepts clés pour les étudiants :
 * - Accessibilité : role="alert" et aria-live="polite" annoncent les erreurs
 * - Validation : les erreurs viennent du schéma Zod ou de setError()
 * - Rendu conditionnel : ne s'affiche que s'il y a un message
 * - Priorité : l'erreur de validation a priorité sur le contenu enfant
 * 
 * Attributs d'accessibilité :
 * - role="alert" : indique aux technologies d'assistance qu'il s'agit d'un message important
 * - aria-live="polite" : annonce le message sans interrompre la lecture en cours
 * 
 * @example
 * ```tsx
 * // Affichage automatique des erreurs de validation
 * <FormField name="email">
 *   <FormControl>
 *     <Input type="email" />
 *   </FormControl>
 *   <FormMessage />
 * </FormField>
 * 
 * // Avec un message personnalisé par défaut
 * <FormMessage>Ce champ sera vérifié automatiquement</FormMessage>
 * ```
 */

"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

/**
 * Interface des props de FormMessage
 * 
 * @property children - Message par défaut si aucune erreur n'est présente
 * Les autres props sont héritées de HTMLParagraphElement
 */
export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

/**
 * Composant FormMessage - Affiche les erreurs de validation
 * 
 * Ce composant :
 * 1. Récupère l'état du champ depuis le contexte
 * 2. Affiche l'erreur de validation si présente
 * 3. Sinon affiche le contenu enfant (message par défaut)
 * 4. Ne rend rien s'il n'y a ni erreur ni enfant
 * 
 * L'ID du message est utilisé par FormControl pour créer le lien
 * aria-describedby, permettant aux lecteurs d'écran d'associer
 * l'erreur au champ correspondant.
 * 
 * @param children - Message par défaut (affiché s'il n'y a pas d'erreur)
 * @param className - Classes CSS pour personnaliser le style
 */
function FormMessage({ children, className, ...props }: FormMessageProps) {
  // Récupère l'ID et l'état d'erreur du champ
  const { id, fieldState } = useFormField()
  const messageId = `${id}-message`
  
  // L'erreur de validation a priorité sur le contenu enfant
  const message = fieldState.error || children

  // Ne rend rien s'il n'y a pas de message à afficher
  if (!message) {
    return null
  }

  return (
    <p
      id={messageId}
      data-slot="form-message"
      data-error={fieldState.error ? "true" : undefined}
      className={className}
      // Attributs d'accessibilité pour annoncer les erreurs
      role="alert"
      aria-live="polite"
      {...props}
    >
      {message}
    </p>
  )
}

export { FormMessage }
