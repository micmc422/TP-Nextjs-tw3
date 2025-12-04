/**
 * Contexte de Formulaire - Gestion d'État et Validation avec React Context
 * 
 * Ce fichier définit le système central de gestion des formulaires.
 * Il utilise React Context pour partager l'état du formulaire entre tous
 * les composants enfants, évitant le "prop drilling".
 * 
 * Concepts clés pour les étudiants :
 * - React Context : partage de données à travers l'arbre de composants
 * - Pattern Provider : le FormProvider encapsule la logique d'état
 * - Validation Zod : validation de schéma déclarative et typée
 * - Hooks React : useState, useCallback, useMemo pour la performance
 * 
 * Architecture :
 * - FormState : stocke les valeurs, erreurs, et métadonnées du formulaire
 * - FormProvider : composant qui gère l'état et fournit le contexte
 * - useFormContext : hook pour accéder au contexte depuis les enfants
 * 
 * États du formulaire :
 * - values : les valeurs actuelles de tous les champs
 * - errors : les messages d'erreur par champ
 * - touched : quels champs ont été visités (blur)
 * - dirty : quels champs ont été modifiés
 * - isSubmitting : si le formulaire est en cours de soumission
 * - isValid : si le formulaire passe la validation
 */

"use client"

import * as React from "react"
import { z, type ZodType, type ZodError } from "zod"

/**
 * Interface pour l'état d'un champ individuel
 * 
 * Utilisée par les composants comme FormControl et FormMessage
 * pour accéder à l'état spécifique d'un champ.
 * 
 * @property value - Valeur actuelle du champ
 * @property error - Message d'erreur (null si valide)
 * @property touched - true si l'utilisateur a quitté le champ (onBlur)
 * @property dirty - true si la valeur a été modifiée
 */
export interface FormFieldState {
  value: unknown
  error: string | null
  touched: boolean
  dirty: boolean
}

/**
 * Interface pour l'état global du formulaire
 * 
 * @template T - Type des valeurs du formulaire (structure des données)
 */
export interface FormState<T extends Record<string, unknown>> {
  values: T                                    // Valeurs de tous les champs
  errors: Partial<Record<keyof T, string>>     // Erreurs par nom de champ
  touched: Partial<Record<keyof T, boolean>>   // Champs visités
  dirty: Partial<Record<keyof T, boolean>>     // Champs modifiés
  isSubmitting: boolean                        // Soumission en cours
  isValid: boolean                             // Formulaire valide
}

/**
 * Interface du contexte de formulaire
 * 
 * Définit toutes les valeurs et fonctions disponibles via le contexte.
 * Les composants enfants utilisent useFormContext pour accéder à ces fonctionnalités.
 * 
 * @template T - Type des valeurs du formulaire
 */
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

/**
 * Props du composant FormProvider
 * 
 * @template T - Type des valeurs du formulaire
 * @property children - Composants enfants qui auront accès au contexte
 * @property initialValues - Valeurs initiales du formulaire
 * @property schema - Schéma Zod optionnel pour la validation
 * @property onSubmit - Callback appelé lors de la soumission valide
 */
export interface FormProviderProps<T extends Record<string, unknown>> {
  children: React.ReactNode
  initialValues: T
  schema?: ZodType<T>
  onSubmit?: (values: T) => void | Promise<void>
}

/**
 * Création du contexte de formulaire
 * 
 * La valeur par défaut est null, ce qui permet de détecter
 * si useFormContext est utilisé en dehors d'un FormProvider.
 */
const FormContext = React.createContext<FormContextValue<Record<string, unknown>> | null>(null)

/**
 * Hook useFormContext - Accède au contexte du formulaire
 * 
 * Ce hook permet aux composants enfants d'accéder à l'état
 * et aux fonctions du formulaire.
 * 
 * @template T - Type des valeurs du formulaire
 * @throws Error si utilisé en dehors d'un FormProvider
 * @returns L'intégralité du contexte de formulaire
 */
export function useFormContext<T extends Record<string, unknown>>(): FormContextValue<T> {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext doit être utilisé à l'intérieur d'un FormProvider")
  }
  return context as unknown as FormContextValue<T>
}

/**
 * Composant FormProvider - Fournit le contexte de formulaire
 * 
 * Ce composant gère l'état du formulaire et expose des fonctions
 * pour manipuler les valeurs, valider les données et soumettre le formulaire.
 * 
 * Fonctionnalités principales :
 * - Gestion des valeurs avec setValue/register
 * - Validation avec schéma Zod
 * - Suivi des champs touchés et modifiés
 * - Soumission avec gestion des erreurs
 * 
 * @template T - Type des valeurs du formulaire
 */
export function FormProvider<T extends Record<string, unknown>>({
  children,
  initialValues,
  schema,
}: FormProviderProps<T>) {
  // État principal du formulaire
  const [state, setState] = React.useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    dirty: {},
    isSubmitting: false,
    isValid: true,
  })

  /**
   * Met à jour la valeur d'un champ
   * Marque également le champ comme "dirty" (modifié)
   */
  const setValue = React.useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setState((prev) => ({
      ...prev,
      values: { ...prev.values, [name]: value },
      dirty: { ...prev.dirty, [name]: true },
    }))
  }, [])

  /**
   * Définit ou efface l'erreur d'un champ
   * @param error - Message d'erreur ou null pour effacer
   */
  const setError = React.useCallback(<K extends keyof T>(name: K, error: string | null) => {
    setState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [name]: error ?? undefined },
    }))
  }, [])

  /**
   * Marque un champ comme touché (après un blur)
   * Utile pour afficher les erreurs seulement après interaction
   */
  const setTouched = React.useCallback(<K extends keyof T>(name: K, touched = true) => {
    setState((prev) => ({
      ...prev,
      touched: { ...prev.touched, [name]: touched },
    }))
  }, [])

  /**
   * Récupère l'état complet d'un champ spécifique
   * Utilisé par FormField pour créer le contexte du champ
   */
  const getFieldState = React.useCallback(<K extends keyof T>(name: K): FormFieldState => ({
    value: state.values[name],
    error: state.errors[name] ?? null,
    touched: state.touched[name] ?? false,
    dirty: state.dirty[name] ?? false,
  }), [state.values, state.errors, state.touched, state.dirty])

  /**
   * Valide le formulaire avec le schéma Zod
   * 
   * @returns Promise<boolean> - true si valide, false sinon
   * 
   * Fonctionnement :
   * 1. Parse les valeurs avec le schéma Zod
   * 2. Si valide : efface les erreurs, retourne true
   * 3. Si invalide : extrait les erreurs, met à jour l'état, retourne false
   */
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
        // Extrait le premier message d'erreur pour chaque champ
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

  /**
   * Réinitialise le formulaire
   * 
   * @param values - Valeurs optionnelles pour remplacer les initiales
   */
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

  /**
   * Crée un gestionnaire de soumission
   * 
   * Cette fonction retourne un gestionnaire d'événement qui :
   * 1. Empêche la soumission native du formulaire
   * 2. Définit isSubmitting à true
   * 3. Valide le formulaire
   * 4. Si valide, appelle le callback onSubmit
   * 5. Réinitialise isSubmitting
   * 
   * @param submitHandler - Fonction à appeler avec les valeurs validées
   */
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
            console.error("Erreur lors de la soumission du formulaire:", error)
          }
        }

        setState((prev) => ({ ...prev, isSubmitting: false }))
      },
    [validate, state.values]
  )

  /**
   * Crée les props pour un champ de formulaire
   * 
   * Cette fonction facilite la liaison d'un input avec l'état du formulaire.
   * Elle retourne un objet avec value, onChange et onBlur.
   * 
   * @param name - Nom du champ à enregistrer
   * @returns Objet avec les props à passer à l'input
   * 
   * @example
   * ```tsx
   * const { register } = useFormContext()
   * <input {...register("email")} type="email" />
   * ```
   */
  const register = React.useCallback(<K extends keyof T>(name: K) => ({
    value: state.values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target
      // Gère différemment les checkboxes (checked vs value)
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

  // Mémorise la valeur du contexte pour éviter les re-renders inutiles
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
