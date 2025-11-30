"use client"

import * as React from "react"
import { useFormContext, type FormFieldState } from "@workspace/form/context/FormContext"

export interface FormFieldContextValue {
  name: string
  id: string
  fieldState: FormFieldState
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

/**
 * Hook to access the field context
 */
export function useFormField(): FormFieldContextValue {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("useFormField must be used within a FormField")
  }
  return context
}

export interface FormFieldProps {
  children: React.ReactNode
  name: string
  className?: string
}

/**
 * FormField component that provides field-level context
 */
function FormField({ children, name, className }: FormFieldProps) {
  const { getFieldState } = useFormContext()
  const fieldState = getFieldState(name)
  const id = React.useId()

  const contextValue = React.useMemo<FormFieldContextValue>(
    () => ({
      name,
      id: `${id}-${name}`,
      fieldState,
    }),
    [name, id, fieldState]
  )

  return (
    <FormFieldContext.Provider value={contextValue}>
      <div className={className} data-slot="form-field">
        {children}
      </div>
    </FormFieldContext.Provider>
  )
}

export { FormField, FormFieldContext }
