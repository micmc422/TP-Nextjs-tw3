"use client"

import * as React from "react"
import { FormProvider, useFormContext, type FormProviderProps } from "@workspace/form/context/FormContext"

export interface FormProps<T extends Record<string, unknown>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    FormProviderProps<T> {}

/**
 * Form component that wraps FormProvider and provides form element
 */
function FormInner<T extends Record<string, unknown>>(
  { children, className, initialValues, schema, onSubmit, ...props }: FormProps<T>,
  ref: React.ForwardedRef<HTMLFormElement>
) {
  return (
    <FormProvider initialValues={initialValues} schema={schema} onSubmit={onSubmit}>
      <FormElement ref={ref} className={className} onSubmit={onSubmit} {...props}>
        {children}
      </FormElement>
    </FormProvider>
  )
}

// Helper component to access form context for submit handler
function FormElementInner<T extends Record<string, unknown>>(
  {
    children,
    onSubmit,
    ...props
  }: React.FormHTMLAttributes<HTMLFormElement> & {
    onSubmit?: (values: T) => void | Promise<void>
  },
  ref: React.ForwardedRef<HTMLFormElement>
) {
  const { handleSubmit } = useFormContext<T>()

  return (
    <form
      ref={ref}
      onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
      {...props}
    >
      {children}
    </form>
  )
}

const FormElement = React.forwardRef(FormElementInner) as <T extends Record<string, unknown>>(
  props: React.FormHTMLAttributes<HTMLFormElement> & {
    onSubmit?: (values: T) => void | Promise<void>
  } & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement

const Form = React.forwardRef(FormInner) as <T extends Record<string, unknown>>(
  props: FormProps<T> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement

export { Form }
