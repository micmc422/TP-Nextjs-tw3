/**
 * Schéma de Validation et Types pour le Créateur de Pokémon
 * 
 * Ce fichier centralise la validation des données du formulaire de création
 * de Pokémon en utilisant Zod, une librairie de validation TypeScript-first.
 * 
 * Concepts clés pour les étudiants :
 * - Zod permet de définir des schémas de validation déclaratifs
 * - Les schémas Zod génèrent automatiquement les types TypeScript
 * - z.infer<> extrait le type d'un schéma Zod
 * - Les messages d'erreur sont personnalisables pour chaque règle
 * 
 * Avantages de Zod :
 * - Validation identique côté client et serveur
 * - Types TypeScript automatiques
 * - Messages d'erreur localisables
 * - Coercion de types (ex: string → number)
 */

import { z } from "zod"

/**
 * Schéma de validation pour le formulaire de création de Pokémon
 * 
 * Chaque champ a ses propres règles de validation avec des messages en français.
 * z.coerce.number() convertit automatiquement les strings en nombres.
 */
export const pokemonFormSchema = z.object({
  // Nom du Pokémon : entre 2 et 50 caractères
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),

  // Type du Pokémon : doit être l'un des 18 types officiels
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

  // Statistiques : coercion string → number avec validation de plage
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

  // Talent : entre 2 et 50 caractères
  ability: z
    .string()
    .min(2, "Le talent doit contenir au moins 2 caractères")
    .max(50, "Le talent ne peut pas dépasser 50 caractères"),

  // Description : entre 10 et 500 caractères
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),

  // URL d'image : optionnelle, mais doit être une URL valide si fournie
  // z.literal("") permet d'accepter une chaîne vide
  imageUrl: z.string().url("L'URL de l'image n'est pas valide").optional().or(z.literal("")),
})

/**
 * Type inféré depuis le schéma Zod
 * Utilisé pour typer les données validées dans les composants
 */
export type PokemonFormData = z.infer<typeof pokemonFormSchema>

/**
 * Interface pour l'état retourné par la Server Action
 * Utilisé pour communiquer le résultat de l'action au client
 */
export interface PokemonFormState {
  success: boolean                      // Indique si l'action a réussi
  message?: string                      // Message à afficher à l'utilisateur
  data?: {
    pdfBase64: string                   // PDF encodé en base64 (Data URI)
    filename: string                    // Nom du fichier pour le téléchargement
  }
  errors?: Record<string, string[]>     // Erreurs de validation par champ
}

/**
 * Mapping des couleurs RGB par type de Pokémon
 * Utilisé pour colorier le PDF généré selon le type choisi
 * 
 * Les valeurs correspondent aux couleurs officielles des types Pokémon
 */
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
