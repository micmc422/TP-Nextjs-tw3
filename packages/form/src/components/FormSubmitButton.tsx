"use client"

import * as React from "react"
import { useFormStatus } from "react-dom"

export interface FormSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Text to display while submitting */
  pendingText?: string
  /** Children to display when not pending */
  children: React.ReactNode
}

/**
 * FormSubmitButton component that automatically shows pending state
 * when used inside a form with a server action.
 * 
 * Uses React 19's useFormStatus hook for automatic pending detection.
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
 */
function FormSubmitButton({
  children,
  pendingText = "Envoi en cours...",
  disabled,
  className,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      data-slot="form-submit-button"
      data-pending={pending ? "true" : undefined}
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      aria-busy={pending}
      className={className}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  )
}

export { FormSubmitButton }
