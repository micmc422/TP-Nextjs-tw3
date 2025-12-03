/**
 * Bouton de Soumission de Formulaire avec État de Chargement
 * 
 * Ce composant utilise le hook useFormStatus de React 19 pour détecter
 * automatiquement quand un formulaire est en cours de soumission.
 * 
 * Concepts clés pour les étudiants :
 * - useFormStatus : hook React 19 qui détecte l'état de soumission du formulaire parent
 * - Le bouton se désactive automatiquement pendant la soumission
 * - Le texte change pour indiquer l'état de chargement
 * - Accessibilité : aria-disabled et aria-busy pour les lecteurs d'écran
 * 
 * Note : Ce composant doit être utilisé à l'intérieur d'un <form> avec une Server Action
 */

"use client"

import * as React from "react"
// Hook React 19 pour accéder à l'état de soumission du formulaire parent
import { useFormStatus } from "react-dom"

export interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Texte à afficher pendant la soumission */
  pendingText?: string
  /** Contenu à afficher quand le formulaire n'est pas en cours de soumission */
  children: React.ReactNode
}

/**
 * Composant FormSubmitButton - Bouton de soumission avec gestion automatique du chargement
 * 
 * Utilise useFormStatus pour détecter automatiquement quand le formulaire parent
 * est en cours de soumission via une Server Action.
 * 
 * @example
 * ```tsx
 * <form action={serverAction}>
 *   <input name="name" />
 *   <FormSubmitButton pendingText="Création en cours...">
 *     Créer le Pokémon
 *   </FormSubmitButton>
 * </form>
 * ```
 * 
 * @param pendingText - Texte affiché pendant la soumission
 * @param children - Contenu du bouton en état normal
 * @param disabled - Peut être désactivé manuellement en plus de l'état pending
 * @param className - Classes CSS personnalisées
 */
function FormSubmitButton({
  children,
  pendingText = "Envoi en cours...",
  disabled,
  className,
  ...props
}: FormSubmitButtonProps) {
  // useFormStatus retourne l'état du formulaire parent le plus proche
  // pending est true quand une Server Action est en cours
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      data-slot="form-submit-button"
      data-pending={pending ? "true" : undefined}
      // Désactivé si pending OU si disabled manuellement
      disabled={pending || disabled}
      // Attributs d'accessibilité
      aria-disabled={pending || disabled}
      aria-busy={pending}
      className={className}
      {...props}
    >
      {/* Affiche pendingText pendant la soumission, sinon children */}
      {pending ? pendingText : children}
    </button>
  )
}

export { FormSubmitButton }
