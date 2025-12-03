/**
 * Server Action pour la Création de PDF Pokémon
 * 
 * Ce fichier contient une Server Action qui génère un PDF avec les informations
 * d'un Pokémon inventé par l'utilisateur. C'est un exemple concret d'utilisation
 * des Server Actions de Next.js.
 * 
 * Concepts clés pour les étudiants :
 * - "use server" marque ce fichier comme contenant uniquement du code serveur
 * - Les Server Actions sont des fonctions asynchrones appelables depuis le client
 * - Elles reçoivent un FormData et retournent un état typé
 * - La validation se fait côté serveur avec Zod pour plus de sécurité
 * - jsPDF génère le document PDF côté serveur
 * 
 * Sécurité : Toute la logique sensible reste côté serveur, le client ne voit
 * que le résultat (base64 du PDF ou erreurs de validation).
 */

"use server"

// Librairie de génération de PDF
import { jsPDF } from "jspdf"
// Import du schéma de validation et des couleurs par type
import { pokemonFormSchema, typeColors, type PokemonFormState } from "./schema"

/**
 * Server Action pour créer un PDF avec les informations du Pokémon inventé
 * 
 * Cette fonction est appelée automatiquement par le formulaire côté client
 * grâce à l'attribut action du <form>.
 * 
 * @param _prevState - État précédent (requis par useActionState mais non utilisé ici)
 * @param formData - Données du formulaire envoyées par le navigateur
 * @returns État avec succès/erreur et optionnellement les données du PDF
 * 
 * Flux d'exécution :
 * 1. Extraction des données du FormData
 * 2. Validation avec Zod
 * 3. Si erreurs → retour des erreurs par champ
 * 4. Génération du PDF avec jsPDF
 * 5. Conversion en base64 et retour au client
 */
export async function createPokemonPdfAction(
  _prevState: PokemonFormState,
  formData: FormData
): Promise<PokemonFormState> {
  // Simulation d'un délai réseau pour démontrer les états de chargement
  // En production, on retirerait cette ligne
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Extraction des données du formulaire
  // FormData.get() retourne string | File | null
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

  // Validation des données avec le schéma Zod défini dans schema.ts
  // safeParse retourne un objet avec success et data/error
  const validationResult = pokemonFormSchema.safeParse(rawData)

  // Si la validation échoue, on retourne les erreurs formatées par champ
  if (!validationResult.success) {
    const fieldErrors: Record<string, string[]> = {}
    // Conversion des erreurs Zod en format utilisable par le formulaire
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

  // Données validées et typées
  const data = validationResult.data
  // Récupération de la couleur associée au type choisi (avec fallback)
  const typeColor = typeColors[data.type] ?? typeColors.normal ?? { r: 168, g: 168, b: 120 }

  try {
    // ===== GÉNÉRATION DU PDF AVEC jsPDF =====
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // --- En-tête coloré selon le type ---
    doc.setFillColor(typeColor.r, typeColor.g, typeColor.b)
    doc.rect(0, 0, pageWidth, 40, "F") // F = Fill (remplir)

    // --- Titre du Pokémon ---
    doc.setTextColor(255, 255, 255) // Texte blanc
    doc.setFontSize(28)
    doc.setFont("helvetica", "bold")
    doc.text(data.name.toUpperCase(), pageWidth / 2, 25, { align: "center" })

    // --- Badge du type ---
    doc.setFontSize(12)
    doc.text(`Type: ${data.type.toUpperCase()}`, pageWidth / 2, 35, { align: "center" })

    // Réinitialisation de la couleur du texte pour le contenu
    doc.setTextColor(0, 0, 0) // Noir

    // --- Section Statistiques ---
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Statistiques", 20, 60)

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")

    // Définition des statistiques à afficher
    const stats = [
      { name: "PV (HP)", value: data.hp },
      { name: "Attaque", value: data.attack },
      { name: "Défense", value: data.defense },
      { name: "Vitesse", value: data.speed },
    ]

    // Affichage des barres de progression pour chaque stat
    let yPos = 75
    stats.forEach((stat) => {
      // Nom de la statistique
      doc.text(`${stat.name}:`, 25, yPos)

      // Paramètres de la barre de progression
      const barWidth = 100
      const barHeight = 8
      const barX = 70
      const barY = yPos - 6

      // Fond de la barre (gris)
      doc.setFillColor(220, 220, 220)
      doc.rect(barX, barY, barWidth, barHeight, "F")

      // Remplissage proportionnel à la valeur (max théorique = 255)
      const fillWidth = Math.min((stat.value / 255) * barWidth, barWidth)
      doc.setFillColor(typeColor.r, typeColor.g, typeColor.b)
      doc.rect(barX, barY, fillWidth, barHeight, "F")

      // Affichage de la valeur numérique
      doc.text(String(stat.value), 175, yPos)

      yPos += 15
    })

    // --- Section Talent ---
    yPos += 10
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Talent", 20, yPos)

    yPos += 15
    doc.setFontSize(12)
    doc.setFont("helvetica", "italic")
    doc.text(data.ability, 25, yPos)

    // --- Section Description ---
    yPos += 20
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text("Description", 20, yPos)

    yPos += 15
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    // Découpage automatique de la description en lignes
    const descriptionLines = doc.splitTextToSize(data.description, pageWidth - 50)
    doc.text(descriptionLines, 25, yPos)

    // --- URL de l'image (optionnel) ---
    if (data.imageUrl) {
      yPos += descriptionLines.length * 6 + 20
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Image: ${data.imageUrl}`, 20, yPos)
    }

    // --- Pied de page ---
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Généré le ${new Date().toLocaleDateString("fr-FR")} - Pokémon inventé avec Next.js`,
      pageWidth / 2,
      285,
      { align: "center" }
    )

    // Conversion du PDF en chaîne base64 (Data URI)
    const pdfBase64 = doc.output("datauristring")
    // Nom du fichier pour le téléchargement
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
    // Gestion des erreurs de génération du PDF
    console.error("Erreur lors de la génération du PDF:", error)
    return {
      success: false,
      message: "Une erreur est survenue lors de la génération du PDF",
    }
  }
}
