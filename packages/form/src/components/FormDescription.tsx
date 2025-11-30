"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

/**
 * FormDescription component for field descriptions
 */
function FormDescription({ children, className, ...props }: FormDescriptionProps) {
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
