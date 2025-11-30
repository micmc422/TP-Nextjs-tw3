"use client"

import * as React from "react"
import { z, type ZodType, type ZodError } from "zod"

export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T
  schema?: ZodType<T>
  onSubmit?: (values: T) => void | Promise<void>
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  setValue: <K extends keyof T>(name: K, value: T[K]) => void
  setError: <K extends keyof T>(name: K, error: string | null) => void
  setTouched: <K extends keyof T>(name: K, touched?: boolean) => void
  validate: () => Promise<boolean>
  reset: (values?: Partial<T>) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  register: <K extends keyof T>(name: K) => {
    value: T[K]
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    onBlur: () => void
    name: string
  }
}

/**
 * Custom hook for form management with validation
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = React.useState<T>(initialValues)
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isValid, setIsValid] = React.useState(true)

  const setValue = React.useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  const setError = React.useCallback(<K extends keyof T>(name: K, error: string | null) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error ?? undefined,
    }))
  }, [])

  const setFieldTouched = React.useCallback(<K extends keyof T>(name: K, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }))
  }, [])

  const validate = React.useCallback(async (): Promise<boolean> => {
    if (!schema) {
      return true
    }

    try {
      schema.parse(values)
      setErrors({})
      setIsValid(true)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as ZodError<T>
        const newErrors: Partial<Record<keyof T, string>> = {}
        zodError.errors.forEach((err) => {
          const path = err.path[0] as keyof T
          if (path && !newErrors[path]) {
            newErrors[path] = err.message
          }
        })
        setErrors(newErrors)
        setIsValid(false)
        return false
      }
      return false
    }
  }, [schema, values])

  const reset = React.useCallback((newValues?: Partial<T>) => {
    setValues(newValues ? { ...initialValues, ...newValues } : initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    setIsValid(true)
  }, [initialValues])

  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault()
      }

      setIsSubmitting(true)

      const validationResult = await validate()
      if (validationResult && onSubmit) {
        try {
          await onSubmit(values)
        } catch (error) {
          console.error("Form submission error:", error)
        }
      }

      setIsSubmitting(false)
    },
    [validate, values, onSubmit]
  )

  const register = React.useCallback(<K extends keyof T>(name: K) => ({
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target
      const value = target.type === "checkbox"
        ? (target as HTMLInputElement).checked
        : target.value
      setValue(name, value as T[K])
    },
    onBlur: () => {
      setFieldTouched(name, true)
    },
    name: name as string,
  }), [values, setValue, setFieldTouched])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setError,
    setTouched: setFieldTouched,
    validate,
    reset,
    handleSubmit,
    register,
  }
}
