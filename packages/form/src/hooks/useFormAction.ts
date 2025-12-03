/**
 * Hook useFormAction - Gestion des Server Actions avec React 19
 * 
 * Ce hook encapsule la logique de soumission de formulaires vers des Server Actions
 * en utilisant les nouveaux hooks React 19 : useTransition et useOptimistic.
 * 
 * Concepts clés pour les étudiants :
 * - useTransition : permet de marquer des mises à jour comme non-urgentes
 * - useOptimistic : permet d'afficher un état optimiste avant la réponse serveur
 * - Server Actions : fonctions exécutées côté serveur appelables depuis le client
 * - FormData : format standard pour l'envoi de données de formulaire
 * 
 * Avantages :
 * - UX améliorée avec feedback immédiat (optimistic updates)
 * - Pas de blocage de l'interface pendant la soumission
 * - Gestion d'erreurs centralisée
 */

"use client"

import * as React from "react"

/**
 * État retourné par la Server Action
 * 
 * @template T - Type des données retournées en cas de succès
 */
export interface FormActionState<T = unknown> {
  success: boolean               // Indique si l'action a réussi
  message?: string              // Message à afficher à l'utilisateur
  data?: T                      // Données retournées (ex: URL du PDF généré)
  errors?: Record<string, string[]>  // Erreurs de validation par champ
}

/**
 * Options de configuration du hook useFormAction
 * 
 * @template TInput - Type des données d'entrée du formulaire
 * @template TOutput - Type des données retournées par l'action
 */
export interface UseFormActionOptions<TInput, TOutput> {
  /** La fonction Server Action à appeler */
  action: (prevState: FormActionState<TOutput>, formData: FormData) => Promise<FormActionState<TOutput>>
  /** État initial (avant toute soumission) */
  initialState?: FormActionState<TOutput>
  /** Callback appelé en cas de succès */
  onSuccess?: (data: TOutput | undefined, state: FormActionState<TOutput>) => void
  /** Callback appelé en cas d'erreur */
  onError?: (state: FormActionState<TOutput>) => void
  /** Transformer les valeurs typées en FormData avant envoi */
  transformData?: (values: TInput) => FormData
  /** Message affiché pendant la soumission */
  pendingMessage?: string
  /** Message affiché en cas d'erreur inattendue */
  errorMessage?: string
}

/**
 * Type de retour du hook useFormAction
 * 
 * @template TInput - Type des données d'entrée
 * @template TOutput - Type des données de sortie
 */
export interface UseFormActionReturn<TInput, TOutput> {
  /** État actuel retourné par la Server Action */
  state: FormActionState<TOutput>
  /** État optimiste pour un feedback UI immédiat */
  optimisticState: FormActionState<TOutput>
  /** Indique si une action est en cours */
  isPending: boolean
  /** Soumettre avec un FormData brut */
  submit: (formData: FormData) => void
  /** Soumettre avec des valeurs typées */
  submitWithValues: (values: TInput) => void
  /** Action à passer à l'attribut action d'un <form> */
  formAction: (formData: FormData) => void
  /** Définir un état optimiste manuellement */
  setOptimistic: (state: Partial<FormActionState<TOutput>>) => void
  /** Réinitialiser l'état */
  reset: () => void
}

/** État initial par défaut */
const defaultInitialState: FormActionState = {
  success: false,
  message: undefined,
  data: undefined,
  errors: undefined,
}

/**
 * Hook useFormAction - Gère les Server Actions avec états de chargement et optimisme
 * 
 * Ce hook simplifie l'utilisation des Server Actions en gérant automatiquement :
 * - L'état de chargement (isPending)
 * - Les mises à jour optimistes (feedback immédiat)
 * - Les callbacks de succès/erreur
 * - La conversion des données en FormData
 * 
 * @example
 * ```tsx
 * const { state, isPending, formAction } = useFormAction({
 *   action: createPokemonAction,
 *   onSuccess: (data) => console.log('Succès !', data),
 *   onError: (state) => console.error('Erreur :', state.message),
 * })
 * 
 * return (
 *   <form action={formAction}>
 *     <input name="name" />
 *     <button type="submit" disabled={isPending}>
 *       {isPending ? 'Création...' : 'Créer'}
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
  // État réel retourné par la Server Action
  const [state, setState] = React.useState<FormActionState<TOutput>>(initialState)
  
  // useTransition permet de marquer les mises à jour comme non-urgentes
  // isPending sera true pendant l'exécution de la transition
  const [isPending, startTransition] = React.useTransition()
  
  /**
   * useOptimistic permet d'afficher un état temporaire pendant l'attente
   * du serveur, puis il est automatiquement remplacé par l'état réel
   */
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

  /**
   * Soumet le formulaire avec un FormData
   * Utilise startTransition pour ne pas bloquer l'UI
   */
  const submit = React.useCallback(
    (formData: FormData) => {
      startTransition(async () => {
        // Afficher immédiatement un état de chargement optimiste
        setOptimisticState({ success: false, message: pendingMessage })

        try {
          // Appel de la Server Action
          const result = await action(state, formData)
          setState(result)

          // Appel des callbacks appropriés
          if (result.success) {
            onSuccess?.(result.data, result)
          } else {
            onError?.(result)
          }
        } catch (error) {
          // Gestion des erreurs inattendues
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

  /**
   * Soumet le formulaire avec des valeurs typées
   * Convertit automatiquement les valeurs en FormData
   */
  const submitWithValues = React.useCallback(
    (values: TInput) => {
      let formData: FormData
      
      // Utiliser le transformateur personnalisé si fourni
      if (transformData) {
        formData = transformData(values)
      } else {
        // Conversion par défaut des valeurs en FormData
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

  /**
   * Action à passer à l'attribut action d'un <form>
   * Wrapper autour de submit pour la compatibilité avec les formulaires natifs
   */
  const formAction = React.useCallback(
    (formData: FormData) => {
      submit(formData)
    },
    [submit]
  )

  /**
   * Définit un état optimiste manuellement
   * Utile pour des feedbacks personnalisés
   */
  const setOptimistic = React.useCallback(
    (newState: Partial<FormActionState<TOutput>>) => {
      setOptimisticState(newState)
    },
    [setOptimisticState]
  )

  /**
   * Réinitialise l'état à sa valeur initiale
   */
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
