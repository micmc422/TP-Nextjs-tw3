/**
 * Composant Form - Formulaire avec Gestion d'État et Validation
 * 
 * Ce fichier définit le composant principal de formulaire qui encapsule
 * le FormProvider et fournit un élément <form> avec gestion automatique
 * de la soumission.
 * 
 * Concepts clés pour les étudiants :
 * - Pattern de composition : Form enveloppe FormProvider et FormElement
 * - React.forwardRef : permet d'accéder à la ref du DOM de l'élément form
 * - Générique TypeScript <T> : assure le typage des valeurs du formulaire
 * - Séparation des responsabilités : FormInner gère le Provider, FormElement gère la soumission
 * 
 * Avantages de cette architecture :
 * - Encapsulation de la logique complexe de gestion d'état
 * - API simple pour les développeurs utilisant le formulaire
 * - Typage fort avec TypeScript pour éviter les erreurs
 */

"use client"

import * as React from "react"
import { FormProvider, useFormContext, type FormProviderProps } from "@workspace/form/context/FormContext"

/**
 * Interface des props du composant Form
 * 
 * Combine les attributs HTML du formulaire avec les props du FormProvider.
 * Omit<> est utilisé pour exclure onSubmit car nous utilisons notre propre signature.
 * 
 * @template T - Type générique représentant la structure des données du formulaire
 */
export interface FormProps<T extends Record<string, unknown>>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">,
    FormProviderProps<T> {}

/**
 * Composant FormInner - Composant interne qui assemble FormProvider et FormElement
 * 
 * Ce composant est la partie interne utilisée avec forwardRef.
 * Il configure le contexte du formulaire via FormProvider et rend l'élément
 * form HTML via FormElement.
 * 
 * @template T - Type des valeurs du formulaire
 * @param children - Composants enfants (champs de formulaire)
 * @param className - Classes CSS pour le style
 * @param initialValues - Valeurs initiales du formulaire
 * @param schema - Schéma Zod pour la validation
 * @param onSubmit - Fonction appelée lors de la soumission valide
 * @param ref - Référence vers l'élément form du DOM
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

/**
 * Composant FormElementInner - Gère l'élément form HTML et la soumission
 * 
 * Ce composant accède au contexte du formulaire via useFormContext
 * pour récupérer la fonction handleSubmit qui gère la validation
 * et l'appel du callback onSubmit.
 * 
 * Architecture :
 * - Utilise useFormContext pour accéder à l'état global du formulaire
 * - handleSubmit valide les données avant d'appeler onSubmit
 * - La soumission native du formulaire est interceptée
 * 
 * @template T - Type des valeurs du formulaire
 */
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

/**
 * Export de FormElement avec forwardRef
 * 
 * Le cast "as" permet de préserver le typage générique avec forwardRef,
 * ce qui n'est pas supporté nativement par React.forwardRef.
 * Cette technique est couramment utilisée pour les composants génériques.
 */
const FormElement = React.forwardRef(FormElementInner) as <T extends Record<string, unknown>>(
  props: React.FormHTMLAttributes<HTMLFormElement> & {
    onSubmit?: (values: T) => void | Promise<void>
  } & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement

/**
 * Export principal du composant Form
 * 
 * Utilise forwardRef pour permettre l'accès à l'élément form du DOM.
 * Le cast générique permet d'utiliser Form avec n'importe quelle structure de données.
 * 
 * @example
 * ```tsx
 * // Définir le type des données
 * type LoginForm = { email: string; password: string }
 * 
 * // Utiliser le formulaire avec validation Zod
 * <Form<LoginForm>
 *   initialValues={{ email: '', password: '' }}
 *   schema={loginSchema}
 *   onSubmit={(values) => console.log(values)}
 * >
 *   <FormField name="email">...</FormField>
 *   <FormField name="password">...</FormField>
 * </Form>
 * ```
 */
const Form = React.forwardRef(FormInner) as <T extends Record<string, unknown>>(
  props: FormProps<T> & { ref?: React.ForwardedRef<HTMLFormElement> }
) => React.ReactElement

export { Form }
