"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

/**
 * FormMessage component for displaying validation messages
 */
function FormMessage({ children, className, ...props }: FormMessageProps) {
  const { id, fieldState } = useFormField()
  const messageId = `${id}-message`
  const message = fieldState.error || children

  if (!message) {
    return null
  }

  return (
    <p
      id={messageId}
      data-slot="form-message"
      data-error={fieldState.error ? "true" : undefined}
      className={className}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {message}
    </p>
  )
}

export { FormMessage }
