"use client"

import * as React from "react"
import { z, type ZodType, type ZodError } from "zod"

// Types for form state
export interface FormFieldState {
  value: unknown
  error: string | null
  touched: boolean
  dirty: boolean
}

export interface FormState<T extends Record<string, unknown>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  dirty: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
}

export interface FormContextValue<T extends Record<string, unknown>> {
  state: FormState<T>
  setValue: <K extends keyof T>(name: K, value: T[K]) => void
  setError: <K extends keyof T>(name: K, error: string | null) => void
  setTouched: <K extends keyof T>(name: K, touched?: boolean) => void
  getFieldState: <K extends keyof T>(name: K) => FormFieldState
  validate: () => Promise<boolean>
  reset: (values?: Partial<T>) => void
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>
  register: <K extends keyof T>(name: K) => {
    value: T[K]
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    onBlur: () => void
    name: string
  }
}

export interface FormProviderProps<T extends Record<string, unknown>> {
  children: React.ReactNode
  initialValues: T
  schema?: ZodType<T>
  onSubmit?: (values: T) => void | Promise<void>
}

// Create form context
const FormContext = React.createContext<FormContextValue<Record<string, unknown>> | null>(null)

/**
 * Hook to access the form context
 */
export function useFormContext<T extends Record<string, unknown>>(): FormContextValue<T> {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context as unknown as FormContextValue<T>
}

/**
 * FormProvider component that manages form state and validation
 */
export function FormProvider<T extends Record<string, unknown>>({
  children,
  initialValues,
  schema,
}: FormProviderProps<T>) {
  const [state, setState] = React.useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isSubmitting: false,
    isValid: true,
  })

  const setValue = React.useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      dirty: { ...prev.dirty, [name]: true },
    }))
  }, [])

  const setError = React.useCallback(<K extends keyof T>(name: K, error: string | null) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error ?? undefined },
    }))
  }, [])

  const setTouched = React.useCallback(<K extends keyof T>(name: K, touched = true) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched },
    }))
  }, [])

  const getFieldState = React.useCallback(<K extends keyof T>(name: K): FormFieldState => ({
    value: state.values[name],
    error: state.errors[name] ?? null,
    touched: state.touched[name] ?? false,
    dirty: state.dirty[name] ?? false,
  }), [state.values, state.errors, state.touched, state.dirty])

  const validate = React.useCallback(async (): Promise<boolean> => {
    if (!schema) {
      return true
    }

    try {
      schema.parse(state.values)
      setState((prev) => ({ ...prev, errors: {}, isValid: true }))
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as ZodError<T>
        const errors: Partial<Record<keyof T, string>> = {}
        zodError.errors.forEach((err) => {
          const path = err.path[0] as keyof T
          if (path && !errors[path]) {
            errors[path] = err.message
          }
        })
        setState((prev) => ({ ...prev, errors, isValid: false }))
        return false
      }
      return false
    }
  }, [schema, state.values])

  const reset = React.useCallback((values?: Partial<T>) => {
    setState({
      values: values ? { ...initialValues, ...values } : initialValues,
      errors: {},
      touched: {},
      dirty: {},
      isSubmitting: false,
      isValid: true,
    })
  }, [initialValues])

  const handleSubmit = React.useCallback(
    (submitHandler: (values: T) => void | Promise<void>) =>
      async (e?: React.FormEvent) => {
        if (e) {
          e.preventDefault()
        }

        setState((prev) => ({ ...prev, isSubmitting: true }))

        const isValid = await validate()
        if (isValid) {
          try {
            await submitHandler(state.values)
          } catch (error) {
            console.error("Form submission error:", error)
          }
        }

        setState((prev) => ({ ...prev, isSubmitting: false }))
      },
    [validate, state.values]
  )

  const register = React.useCallback(<K extends keyof T>(name: K) => ({
    value: state.values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target
      const value = target.type === "checkbox" 
        ? (target as HTMLInputElement).checked 
        : target.value
      setValue(name, value as T[K])
    },
    onBlur: () => {
      setTouched(name, true)
    },
    name: name as string,
  }), [state.values, setValue, setTouched])

  const contextValue = React.useMemo<FormContextValue<T>>(
    () => ({
      state,
      setValue,
      setError,
      setTouched,
      getFieldState,
      validate,
      reset,
      handleSubmit,
      register,
    }),
    [state, setValue, setError, setTouched, getFieldState, validate, reset, handleSubmit, register]
  )

  return (
    <FormContext.Provider value={contextValue as unknown as FormContextValue<Record<string, unknown>>}>
      {children}
    </FormContext.Provider>
  )
}

export { FormContext }
