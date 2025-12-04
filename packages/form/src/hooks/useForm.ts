/**
 * Hook useForm - Gestion d'État de Formulaire avec Validation
 * 
 * Ce hook personnalisé fournit une solution complète pour la gestion
 * des formulaires, incluant l'état des valeurs, la validation avec Zod,
 * et le suivi des interactions utilisateur.
 * 
 * Concepts clés pour les étudiants :
 * - Custom Hook : encapsule la logique réutilisable
 * - État multiple : gère valeurs, erreurs, touched, isSubmitting
 * - Validation déclarative : utilise un schéma Zod
 * - Pattern "register" : facilite la liaison avec les inputs
 * 
 * Différence avec FormProvider :
 * - useForm : utilisé directement dans un composant, sans Context
 * - FormProvider : partage l'état via Context entre plusieurs composants
 * 
 * Quand utiliser useForm :
 * - Formulaires simples dans un seul composant
 * - Pas besoin de partager l'état entre composants distants
 * - Contrôle total sur la logique du formulaire
 * 
 * @example
 * ```tsx
 * const { values, errors, register, handleSubmit } = useForm({
 *   initialValues: { name: '', email: '' },
 *   schema: myZodSchema,
 *   onSubmit: (values) => console.log(values),
 * })
 * 
 * return (
 *   <form onSubmit={handleSubmit}>
 *     <input {...register('name')} />
 *     {errors.name && <span>{errors.name}</span>}
 *     <button type="submit">Envoyer</button>
 *   </form>
 * )
 * ```
 */

"use client"

import * as React from "react"
import { z, type ZodType, type ZodError } from "zod"

/**
 * Options de configuration du hook useForm
 * 
 * @template T - Type des valeurs du formulaire
 * @property initialValues - Valeurs initiales de tous les champs
 * @property schema - Schéma Zod optionnel pour la validation
 * @property onSubmit - Callback appelé lors de la soumission valide
 */
export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T
  schema?: ZodType<T>
  onSubmit?: (values: T) => void | Promise<void>
}

/**
 * Valeur de retour du hook useForm
 * 
 * @template T - Type des valeurs du formulaire
 * 
 * Propriétés d'état :
 * - values : valeurs actuelles de tous les champs
 * - errors : messages d'erreur par champ
 * - touched : champs qui ont reçu le focus puis l'ont perdu
 * - isSubmitting : soumission en cours
 * - isValid : formulaire valide selon le schéma
 * 
 * Méthodes :
 * - setValue : met à jour la valeur d'un champ
 * - setError : définit une erreur manuellement
 * - setTouched : marque un champ comme touché
 * - validate : déclenche la validation
 * - reset : réinitialise le formulaire
 * - handleSubmit : gestionnaire de soumission
 * - register : crée les props pour un input
 */
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
 * Hook useForm - Gestion complète de formulaire
 * 
 * Ce hook gère tout le cycle de vie d'un formulaire :
 * - Initialisation des valeurs
 * - Suivi des modifications (dirty state)
 * - Validation avec schéma Zod
 * - Gestion de la soumission
 * - Réinitialisation
 * 
 * @template T - Type des valeurs du formulaire
 * @param options - Configuration du formulaire
 * @returns Objet contenant l'état et les méthodes du formulaire
 */
export function useForm<T extends Record<string, unknown>>({
  initialValues,
  schema,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  // États séparés pour une meilleure granularité des mises à jour
  const [values, setValues] = React.useState<T>(initialValues)
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isValid, setIsValid] = React.useState(true)

  /**
   * Met à jour la valeur d'un champ spécifique
   * Utilise une mise à jour fonctionnelle pour éviter les problèmes de closure
   */
  const setValue = React.useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }, [])

  /**
   * Définit ou efface l'erreur d'un champ
   * Passer null efface l'erreur (la convertit en undefined)
   */
  const setError = React.useCallback(<K extends keyof T>(name: K, error: string | null) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error ?? undefined,
    }))
  }, [])

  /**
   * Marque un champ comme touché (après perte du focus)
   * Par défaut, marque comme touché (true)
   */
  const setFieldTouched = React.useCallback(<K extends keyof T>(name: K, isTouched = true) => {
    setTouched((prev) => ({ ...prev, [name]: isTouched }))
  }, [])

  /**
   * Valide le formulaire avec le schéma Zod
   * 
   * @returns Promise<boolean> - true si valide
   * 
   * Processus :
   * 1. Si pas de schéma, retourne true (toujours valide)
   * 2. Parse les valeurs avec le schéma
   * 3. Si succès : efface les erreurs, retourne true
   * 4. Si échec : extrait les erreurs Zod, les stocke, retourne false
   */
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
        // Récupère le premier message d'erreur pour chaque champ
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

  /**
   * Réinitialise le formulaire à son état initial
   * 
   * @param newValues - Valeurs optionnelles à fusionner avec les initiales
   */
  const reset = React.useCallback((newValues?: Partial<T>) => {
    setValues(newValues ? { ...initialValues, ...newValues } : initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
    setIsValid(true)
  }, [initialValues])

  /**
   * Gère la soumission du formulaire
   * 
   * Cette fonction :
   * 1. Empêche la soumission native si appelée avec un événement
   * 2. Active l'état de soumission
   * 3. Valide le formulaire
   * 4. Si valide et callback présent, l'appelle avec les valeurs
   * 5. Désactive l'état de soumission
   */
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
          console.error("Erreur lors de la soumission du formulaire:", error)
        }
      }

      setIsSubmitting(false)
    },
    [validate, values, onSubmit]
  )

  /**
   * Crée les props pour lier un input au formulaire
   * 
   * Cette fonction retourne un objet avec :
   * - value : valeur actuelle du champ
   * - onChange : met à jour la valeur (gère text et checkbox)
   * - onBlur : marque le champ comme touché
   * - name : nom du champ pour la soumission native
   * 
   * @param name - Nom du champ à enregistrer
   * @returns Objet de props à spreader sur l'input
   * 
   * @example
   * ```tsx
   * <input {...register('email')} type="email" />
   * ```
   */
  const register = React.useCallback(<K extends keyof T>(name: K) => ({
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target
      // Les checkboxes utilisent checked, les autres utilisent value
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
