/**
 * Composant FormField - Contexte de Champ de Formulaire
 * 
 * Ce fichier définit le composant FormField qui crée un contexte pour chaque
 * champ de formulaire, permettant aux composants enfants (FormLabel, FormControl,
 * FormMessage) d'accéder aux informations du champ.
 * 
 * Concepts clés pour les étudiants :
 * - React Context : partage de données sans prop drilling
 * - Pattern Provider/Consumer : FormField fournit, les enfants consomment
 * - Hook personnalisé : useFormField encapsule l'accès au contexte
 * - Composition : permet d'assembler des composants modulaires
 * 
 * Architecture du système de formulaire :
 * - FormProvider : gère l'état global (valeurs, erreurs, validation)
 * - FormField : gère le contexte d'un champ spécifique
 * - FormControl : ajoute l'accessibilité aux inputs
 * - FormLabel/FormMessage/FormDescription : composants de présentation
 * 
 * @example
 * ```tsx
 * <Form>
 *   <FormField name="email">
 *     <FormLabel>Email</FormLabel>
 *     <FormControl>
 *       <Input />
 *     </FormControl>
 *     <FormDescription>Nous ne partagerons jamais votre email.</FormDescription>
 *     <FormMessage />
 *   </FormField>
 * </Form>
 * ```
 */

"use client"

import * as React from "react"
import { useFormContext, type FormFieldState } from "@workspace/form/context/FormContext"

/**
 * Interface de la valeur du contexte de champ
 * 
 * Ces informations sont disponibles pour tous les composants enfants
 * de FormField via le hook useFormField.
 * 
 * @property name - Nom du champ (clé dans l'objet des valeurs)
 * @property id - Identifiant unique pour les attributs HTML (label, aria-*)
 * @property fieldState - État actuel du champ (valeur, erreur, touched, dirty)
 */
export interface FormFieldContextValue {
  name: string
  id: string
  fieldState: FormFieldState
}

/**
 * Création du contexte avec null comme valeur par défaut
 * Cela permet de détecter si useFormField est utilisé hors d'un FormField
 */
const FormFieldContext = React.createContext<FormFieldContextValue | null>(null)

/**
 * Hook useFormField - Accède au contexte du champ de formulaire
 * 
 * Ce hook personnalisé :
 * 1. Récupère le contexte du champ via useContext
 * 2. Vérifie que le hook est utilisé dans un FormField
 * 3. Retourne les informations du champ (nom, id, état)
 * 
 * @throws Error si utilisé en dehors d'un FormField (aide au débogage)
 * @returns FormFieldContextValue contenant nom, id et état du champ
 */
export function useFormField(): FormFieldContextValue {
  const context = React.useContext(FormFieldContext)
  if (!context) {
    throw new Error("useFormField doit être utilisé à l'intérieur d'un FormField")
  }
  return context
}

/**
 * Interface des props du composant FormField
 * 
 * @property children - Composants enfants (FormLabel, FormControl, etc.)
 * @property name - Nom du champ, utilisé comme clé dans l'objet des valeurs
 * @property className - Classes CSS optionnelles pour le conteneur
 */
export interface FormFieldProps {
  children: React.ReactNode
  name: string
  className?: string
}

/**
 * Composant FormField - Fournit le contexte pour un champ de formulaire
 * 
 * Ce composant :
 * 1. Récupère l'état du champ depuis le FormContext global
 * 2. Génère un ID unique avec useId (React 18+)
 * 3. Crée la valeur du contexte avec useMemo (optimisation)
 * 4. Fournit le contexte aux composants enfants
 * 
 * @param children - Composants enfants qui consommeront le contexte
 * @param name - Nom du champ (doit correspondre à une clé dans initialValues)
 * @param className - Classes CSS pour personnaliser le conteneur
 */
function FormField({ children, name, className }: FormFieldProps) {
  // Récupère la fonction pour obtenir l'état d'un champ spécifique
  const { getFieldState } = useFormContext()
  
  // Obtient l'état actuel de ce champ (valeur, erreur, touched, dirty)
  const fieldState = getFieldState(name)
  
  // Génère un ID unique stable pour ce composant
  const id = React.useId()

  // Mémorise la valeur du contexte pour éviter les re-renders inutiles
  const contextValue = React.useMemo<FormFieldContextValue>(
    () => ({
      name,
      id: `${id}-${name}`,  // ID combiné pour garantir l'unicité
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
