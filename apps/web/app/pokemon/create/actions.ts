"use server"

import { jsPDF } from "jspdf"
import { pokemonFormSchema, typeColors, type PokemonFormState } from "./schema"

/**
 * Server action pour créer un PDF avec les informations du Pokémon inventé
 */
export async function createPokemonPdfAction(
  _prevState: PokemonFormState,
  formData: FormData
): Promise<PokemonFormState> {
  // Simuler un délai réseau pour démontrer les états de chargement
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Extraire et valider les données du formulaire
  const rawData = {
    name: formData.get("name"),
    type: formData.get("type"),
    hp: formData.get("hp"),
    attack: formData.get("attack"),
    defense: formData.get("defense"),
    speed: formData.get("speed"),
    ability: formData.get("ability"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") || "",
  }

  const validationResult = pokemonFormSchema.safeParse(rawData)

  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {}
    validationResult.error.errors.forEach((error) => {
      const field = error.path[0] as string
      if (!fieldErrors[field]) {
        fieldErrors[field] = []
      }
      fieldErrors[field].push(error.message)
    })

    return {
      success: false,
      message: "Veuillez corriger les erreurs dans le formulaire",
      errors: fieldErrors,
    }
  }

  const data = validationResult.data
  const typeColor = typeColors[data.type] ?? typeColors.normal ?? { r: 168, g: 168, b: 120 }

  try {
    // Créer le PDF
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // En-tête avec couleur du type
    doc.setFillColor(typeColor.r, typeColor.g, typeColor.b)
    doc.rect(0, 0, pageWidth, 40, "F")

    // Titre du Pokémon
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text(data.name.toUpperCase(), pageWidth / 2, 25, { align: "center" })

    // Type badge
    doc.setFontSize(12)
    doc.text(`Type: ${data.type.toUpperCase()}`, pageWidth / 2, 35, { align: "center" })

    // Reset couleur du texte
    doc.setTextColor(0, 0, 0)

    // Section Statistiques
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Statistiques", 20, 60)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    const stats = [
      { name: "PV (HP)", value: data.hp },
      { name: "Attaque", value: data.attack },
      { name: "Défense", value: data.defense },
      { name: "Vitesse", value: data.speed },
    ]

    let yPos = 75
    stats.forEach((stat) => {
      // Nom de la stat
      doc.text(`${stat.name}:`, 25, yPos)

      // Barre de progression
      const barWidth = 100
      const barHeight = 8
      const barX = 70
      const barY = yPos - 6

      // Fond de la barre
      doc.setFillColor(220, 220, 220)
      doc.rect(barX, barY, barWidth, barHeight, "F")

      // Remplissage de la barre (max 255 pour les stats)
      const fillWidth = Math.min((stat.value / 255) * barWidth, barWidth)
      doc.setFillColor(typeColor.r, typeColor.g, typeColor.b)
      doc.rect(barX, barY, fillWidth, barHeight, "F")

      // Valeur
      doc.text(String(stat.value), 175, yPos)

      yPos += 15
    })

    // Section Talent
    yPos += 10
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Talent", 20, yPos)

    yPos += 15
    doc.setFontSize(12)
    doc.setFont("helvetica", "italic")
    doc.text(data.ability, 25, yPos)

    // Section Description
    yPos += 20
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Description", 20, yPos)

    yPos += 15
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    // Découper la description en lignes
    const descriptionLines = doc.splitTextToSize(data.description, pageWidth - 50)
    doc.text(descriptionLines, 25, yPos)

    // Image URL si présente
    if (data.imageUrl) {
      yPos += descriptionLines.length * 6 + 20
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Image: ${data.imageUrl}`, 20, yPos)
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Généré le ${new Date().toLocaleDateString("fr-FR")} - Pokémon inventé avec Next.js`,
      pageWidth / 2,
      285,
      { align: "center" }
    )

    // Convertir en base64
    const pdfBase64 = doc.output("datauristring")
    const filename = `pokemon-${data.name.toLowerCase().replace(/\s+/g, "-")}.pdf`

    return {
      success: true,
      message: `Le PDF de ${data.name} a été généré avec succès !`,
      data: {
        pdfBase64,
        filename,
      },
    }
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error)
    return {
      success: false,
      message: "Une erreur est survenue lors de la génération du PDF",
    }
  }
}
