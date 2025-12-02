"use client"

import * as React from "react"
import { useFormAction } from "@workspace/form/hooks/useFormAction"
import { FormSubmitButton } from "@workspace/form/components/FormSubmitButton"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { createPokemonPdfAction } from "./actions"
import { type PokemonFormState } from "./schema"
import { Loader2, Download, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"

const pokemonTypes = [
  { value: "normal", label: "Normal", color: "bg-gray-400" },
  { value: "fire", label: "Feu", color: "bg-orange-500" },
  { value: "water", label: "Eau", color: "bg-blue-500" },
  { value: "electric", label: "Électrik", color: "bg-yellow-400" },
  { value: "grass", label: "Plante", color: "bg-green-500" },
  { value: "ice", label: "Glace", color: "bg-cyan-300" },
  { value: "fighting", label: "Combat", color: "bg-red-600" },
  { value: "poison", label: "Poison", color: "bg-purple-500" },
  { value: "ground", label: "Sol", color: "bg-amber-600" },
  { value: "flying", label: "Vol", color: "bg-indigo-300" },
  { value: "psychic", label: "Psy", color: "bg-pink-500" },
  { value: "bug", label: "Insecte", color: "bg-lime-500" },
  { value: "rock", label: "Roche", color: "bg-stone-500" },
  { value: "ghost", label: "Spectre", color: "bg-purple-700" },
  { value: "dragon", label: "Dragon", color: "bg-violet-600" },
  { value: "dark", label: "Ténèbres", color: "bg-stone-700" },
  { value: "steel", label: "Acier", color: "bg-slate-400" },
  { value: "fairy", label: "Fée", color: "bg-pink-300" },
]

interface PokemonFormData {
  name: string
  type: string
  hp: string
  attack: string
  defense: string
  speed: string
  ability: string
  description: string
  imageUrl: string
}

const initialFormData: PokemonFormData = {
  name: "",
  type: "",
  hp: "50",
  attack: "50",
  defense: "50",
  speed: "50",
  ability: "",
  description: "",
  imageUrl: "",
}

/**
 * Composant FormField personnalisé pour afficher label, input et erreur
 */
function FormFieldWrapper({
  label,
  name,
  error,
  required = false,
  description,
  children,
}: {
  label: string
  name: string
  error?: string[]
  required?: boolean
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {error && error.length > 0 && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error[0]}
        </p>
      )}
    </div>
  )
}

/**
 * Composant de curseur de statistique avec affichage de valeur
 */
function StatSlider({
  name,
  label,
  value,
  onChange,
  error,
}: {
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string[]
}) {
  return (
    <FormFieldWrapper label={label} name={name} error={error} required>
      <div className="flex items-center gap-4">
        <input
          type="range"
          id={name}
          name={name}
          min="1"
          max="255"
          value={value}
          onChange={onChange}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <Input
          type="number"
          min="1"
          max="999"
          value={value}
          onChange={onChange}
          className="w-20 text-center"
          aria-label={`Valeur de ${label}`}
        />
      </div>
    </FormFieldWrapper>
  )
}

export function PokemonCreatorForm() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [formData, setFormData] = React.useState<PokemonFormData>(initialFormData)

  // Utilisation du hook useFormAction pour gérer les server actions
  const { state, isPending, formAction } = useFormAction<PokemonFormData, PokemonFormState["data"]>({
    action: createPokemonPdfAction,
    initialState: { success: false },
    pendingMessage: "Génération en cours...",
    errorMessage: "Une erreur est survenue",
    onSuccess: (data) => {
      if (data?.pdfBase64) {
        // Télécharger automatiquement le PDF
        const link = document.createElement("a")
        link.href = data.pdfBase64
        link.download = data.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReset = () => {
    setFormData(initialFormData)
    formRef.current?.reset()
  }

  const selectedType = pokemonTypes.find((t) => t.value === formData.type)

  return (
    <div className="space-y-8">
      {/* État optimiste : affichage pendant l'envoi */}
      {isPending && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="flex items-center gap-4 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="font-medium">Génération du PDF en cours...</p>
              <p className="text-sm text-muted-foreground">
                Création de la fiche de {formData.name || "votre Pokémon"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message de succès */}
      {state.success && state.message && !isPending && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="flex items-center gap-4 py-4">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">{state.message}</p>
              <p className="text-sm text-muted-foreground">
                Le téléchargement a dû démarrer automatiquement.
              </p>
            </div>
            {state.data && (
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = state.data!.pdfBase64
                  link.download = state.data!.filename
                  link.click()
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger à nouveau
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Message d'erreur global */}
      {!state.success && state.message && !isPending && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-4">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="font-medium text-destructive">{state.message}</p>
          </CardContent>
        </Card>
      )}

      <form ref={formRef} action={formAction} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Informations de base
            </CardTitle>
            <CardDescription>
              Donnez un nom et un type à votre Pokémon inventé
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormFieldWrapper
              label="Nom du Pokémon"
              name="name"
              error={state.errors?.name}
              required
              description="Le nom apparaîtra en titre sur le PDF"
            >
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Flamdraco"
                aria-invalid={!!state.errors?.name}
                aria-describedby={state.errors?.name ? "name-error" : undefined}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Type"
              name="type"
              error={state.errors?.type}
              required
              description="Le type définira la couleur du PDF"
            >
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!state.errors?.type}
              >
                <option value="">Sélectionner un type...</option>
                {pokemonTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {selectedType && (
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block w-4 h-4 rounded-full ${selectedType.color}`} />
                  <span className="text-sm text-muted-foreground">
                    Type {selectedType.label} sélectionné
                  </span>
                </div>
              )}
            </FormFieldWrapper>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>
              Définissez les statistiques de base de votre Pokémon (1-255)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <StatSlider
                name="hp"
                label="Points de vie (PV)"
                value={formData.hp}
                onChange={handleChange}
                error={state.errors?.hp}
              />
              <StatSlider
                name="attack"
                label="Attaque"
                value={formData.attack}
                onChange={handleChange}
                error={state.errors?.attack}
              />
              <StatSlider
                name="defense"
                label="Défense"
                value={formData.defense}
                onChange={handleChange}
                error={state.errors?.defense}
              />
              <StatSlider
                name="speed"
                label="Vitesse"
                value={formData.speed}
                onChange={handleChange}
                error={state.errors?.speed}
              />
            </div>
          </CardContent>
        </Card>

        {/* Talent et Description */}
        <Card>
          <CardHeader>
            <CardTitle>Talent et Description</CardTitle>
            <CardDescription>
              Ajoutez un talent unique et décrivez votre Pokémon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormFieldWrapper
              label="Talent"
              name="ability"
              error={state.errors?.ability}
              required
              description="Le pouvoir spécial de votre Pokémon"
            >
              <Input
                id="ability"
                name="ability"
                value={formData.ability}
                onChange={handleChange}
                placeholder="Ex: Flamme Ardente"
                aria-invalid={!!state.errors?.ability}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="Description"
              name="description"
              error={state.errors?.description}
              required
              description="Décrivez l'apparence et le comportement de votre Pokémon"
            >
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Ex: Ce Pokémon légendaire vit dans les volcans les plus profonds. Ses flammes peuvent atteindre des températures extrêmes..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                aria-invalid={!!state.errors?.description}
              />
            </FormFieldWrapper>
          </CardContent>
        </Card>

        {/* Image optionnelle */}
        <Card>
          <CardHeader>
            <CardTitle>Image (Optionnel)</CardTitle>
            <CardDescription>
              Ajoutez une URL d&apos;image pour illustrer votre Pokémon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormFieldWrapper
              label="URL de l'image"
              name="imageUrl"
              error={state.errors?.imageUrl}
              description="L'URL sera mentionnée dans le PDF"
            >
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/mon-pokemon.png"
                aria-invalid={!!state.errors?.imageUrl}
              />
            </FormFieldWrapper>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isPending}
          >
            Réinitialiser
          </Button>
          <FormSubmitButton
            pendingText="Génération en cours..."
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 mr-1" />
            Générer le PDF
          </FormSubmitButton>
        </div>
      </form>
    </div>
  )
}
