"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

/**
 * FormLabel component for accessible form labels
 */
function FormLabel({ children, className, ...props }: FormLabelProps) {
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
