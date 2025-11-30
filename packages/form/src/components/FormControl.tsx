"use client"

import * as React from "react"
import { useFormField } from "@workspace/form/components/FormField"

export interface FormControlProps {
  children: React.ReactElement
  className?: string
}

/**
 * FormControl component that wraps form inputs and provides accessibility attributes
 */
function FormControl({ children, className }: FormControlProps) {
  const { id, fieldState, name } = useFormField()
  const descriptionId = `${id}-description`
  const messageId = `${id}-message`

  // Clone the child element with additional props
  const child = React.Children.only(children)
  
  return (
    <div className={className} data-slot="form-control">
      {React.cloneElement(child, {
        id,
        name,
        "aria-describedby": fieldState.error
          ? `${descriptionId} ${messageId}`
          : descriptionId,
        "aria-invalid": fieldState.error ? true : undefined,
        ...child.props,
      })}
    </div>
  )
}

export { FormControl }
