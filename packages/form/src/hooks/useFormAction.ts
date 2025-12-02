"use client"

import * as React from "react"

/**
 * State returned by the server action
 */
export interface FormActionState<T = unknown> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

/**
 * Options for useFormAction hook
 */
export interface UseFormActionOptions<TInput, TOutput> {
  /** Server action function */
  action: (prevState: FormActionState<TOutput>, formData: FormData) => Promise<FormActionState<TOutput>>
  /** Initial state */
  initialState?: FormActionState<TOutput>
  /** Callback on success */
  onSuccess?: (data: TOutput | undefined, state: FormActionState<TOutput>) => void
  /** Callback on error */
  onError?: (state: FormActionState<TOutput>) => void
  /** Transform form values to FormData before sending */
  transformData?: (values: TInput) => FormData
  /** Custom message shown during pending state */
  pendingMessage?: string
  /** Custom message shown when an error occurs */
  errorMessage?: string
}

/**
 * Return type for useFormAction hook
 */
export interface UseFormActionReturn<TInput, TOutput> {
  /** Current state from server action */
  state: FormActionState<TOutput>
  /** Optimistic state for immediate UI feedback */
  optimisticState: FormActionState<TOutput>
  /** Whether the action is currently pending */
  isPending: boolean
  /** Submit the form action */
  submit: (formData: FormData) => void
  /** Submit with typed values */
  submitWithValues: (values: TInput) => void
  /** Form action for native form usage */
  formAction: (formData: FormData) => void
  /** Set optimistic state for immediate feedback */
  setOptimistic: (state: Partial<FormActionState<TOutput>>) => void
  /** Reset state to initial */
  reset: () => void
}

const defaultInitialState: FormActionState = {
  success: false,
  message: undefined,
  data: undefined,
  errors: undefined,
}

/**
 * Custom hook for handling server actions with useTransition and useOptimistic
 * 
 * @example
 * ```tsx
 * const { state, isPending, formAction } = useFormAction({
 *   action: createPokemonAction,
 *   onSuccess: (data) => console.log('Success!', data),
 *   onError: (state) => console.error('Error:', state.message),
 * })
 * 
 * return (
 *   <form action={formAction}>
 *     <input name="name" />
 *     <button type="submit" disabled={isPending}>
 *       {isPending ? 'Creating...' : 'Create'}
 *     </button>
 *   </form>
 * )
 * ```
 */
export function useFormAction<TInput = Record<string, unknown>, TOutput = unknown>({
  action,
  initialState = defaultInitialState as FormActionState<TOutput>,
  onSuccess,
  onError,
  transformData,
  pendingMessage = "Submitting...",
  errorMessage = "An error occurred",
}: UseFormActionOptions<TInput, TOutput>): UseFormActionReturn<TInput, TOutput> {
  const [state, setState] = React.useState<FormActionState<TOutput>>(initialState)
  const [isPending, startTransition] = React.useTransition()
  
  // Optimistic state for immediate UI updates
  const [optimisticState, setOptimisticState] = React.useOptimistic<
    FormActionState<TOutput>,
    Partial<FormActionState<TOutput>>
  >(
    state,
    (currentState, newState) => ({
      ...currentState,
      ...newState,
    })
  )

  const submit = React.useCallback(
    (formData: FormData) => {
      startTransition(async () => {
        // Set optimistic pending state
        setOptimisticState({ success: false, message: pendingMessage })

        try {
          const result = await action(state, formData)
          setState(result)

          if (result.success) {
            onSuccess?.(result.data, result)
          } else {
            onError?.(result)
          }
        } catch (error) {
          const errorState: FormActionState<TOutput> = {
            success: false,
            message: error instanceof Error ? error.message : errorMessage,
          }
          setState(errorState)
          onError?.(errorState)
        }
      })
    },
    [action, state, onSuccess, onError, setOptimisticState, pendingMessage, errorMessage]
  )

  const submitWithValues = React.useCallback(
    (values: TInput) => {
      let formData: FormData
      
      if (transformData) {
        formData = transformData(values)
      } else {
        formData = new FormData()
        Object.entries(values as Record<string, unknown>).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (value instanceof File) {
              formData.append(key, value)
            } else if (typeof value === "object") {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, String(value))
            }
          }
        })
      }
      
      submit(formData)
    },
    [submit, transformData]
  )

  const formAction = React.useCallback(
    (formData: FormData) => {
      submit(formData)
    },
    [submit]
  )

  const setOptimistic = React.useCallback(
    (newState: Partial<FormActionState<TOutput>>) => {
      setOptimisticState(newState)
    },
    [setOptimisticState]
  )

  const reset = React.useCallback(() => {
    setState(initialState)
  }, [initialState])

  return {
    state,
    optimisticState,
    isPending,
    submit,
    submitWithValues,
    formAction,
    setOptimistic,
    reset,
  }
}
