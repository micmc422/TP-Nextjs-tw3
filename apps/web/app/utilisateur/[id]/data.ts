import { findUserById, ObjectId } from "@workspace/database";

/**
 * Interface pour représenter un utilisateur
 */
export interface UserData {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Récupère un utilisateur par son ID depuis MongoDB
 */
export async function getUserById(id: string): Promise<UserData | null> {
  try {
    // Vérifier que l'ID est un ObjectId valide
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const user = await findUserById(id);
    
    if (!user) {
      return null;
    }
    
    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}
