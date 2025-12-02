import { z } from "zod"

// Schema de validation pour le formulaire
export const pokemonFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  type: z.enum(
    [
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
    ],
    { message: "Sélectionnez un type valide" }
  ),
  hp: z.coerce
    .number()
    .min(1, "Les PV doivent être au moins 1")
    .max(999, "Les PV ne peuvent pas dépasser 999"),
  attack: z.coerce
    .number()
    .min(1, "L'attaque doit être au moins 1")
    .max(999, "L'attaque ne peut pas dépasser 999"),
  defense: z.coerce
    .number()
    .min(1, "La défense doit être au moins 1")
    .max(999, "La défense ne peut pas dépasser 999"),
  speed: z.coerce
    .number()
    .min(1, "La vitesse doit être au moins 1")
    .max(999, "La vitesse ne peut pas dépasser 999"),
  ability: z
    .string()
    .min(2, "Le talent doit contenir au moins 2 caractères")
    .max(50, "Le talent ne peut pas dépasser 50 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  imageUrl: z.string().url("L'URL de l'image n'est pas valide").optional().or(z.literal("")),
})

export type PokemonFormData = z.infer<typeof pokemonFormSchema>

// Type pour l'état de l'action du formulaire
export interface PokemonFormState {
  success: boolean
  message?: string
  data?: {
    pdfBase64: string
    filename: string
  }
  errors?: Record<string, string[]>
}

// Couleurs des types pour le PDF
export const typeColors: Record<string, { r: number; g: number; b: number }> = {
  normal: { r: 168, g: 168, b: 120 },
  fire: { r: 240, g: 128, b: 48 },
  water: { r: 104, g: 144, b: 240 },
  electric: { r: 248, g: 208, b: 48 },
  grass: { r: 120, g: 200, b: 80 },
  ice: { r: 152, g: 216, b: 216 },
  fighting: { r: 192, g: 48, b: 40 },
  poison: { r: 160, g: 64, b: 160 },
  ground: { r: 224, g: 192, b: 104 },
  flying: { r: 168, g: 144, b: 240 },
  psychic: { r: 248, g: 88, b: 136 },
  bug: { r: 168, g: 184, b: 32 },
  rock: { r: 184, g: 160, b: 56 },
  ghost: { r: 112, g: 88, b: 152 },
  dragon: { r: 112, g: 56, b: 248 },
  dark: { r: 112, g: 88, b: 72 },
  steel: { r: 184, g: 184, b: 208 },
  fairy: { r: 238, g: 153, b: 172 },
}
