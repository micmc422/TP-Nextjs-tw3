"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateUser, deleteUser } from "@workspace/database";

/**
 * Server Action pour mettre à jour un utilisateur
 */
export async function updateUserAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  
  if (!id || !name || !email) {
    redirect(`/utilisateur/${id}?edit=true&error=Tous%20les%20champs%20sont%20requis`);
  }
  
  try {
    await updateUser(id, { name, email });
    revalidatePath(`/utilisateur/${id}`);
    revalidatePath("/utilisateur");
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    redirect(`/utilisateur/${id}?edit=true&error=Erreur%20lors%20de%20la%20mise%20%C3%A0%20jour`);
  }
  
  redirect(`/utilisateur/${id}`);
}

/**
 * Server Action pour supprimer un utilisateur
 */
export async function deleteUserAction(formData: FormData): Promise<void> {
  const id = formData.get("id") as string;
  
  if (!id) {
    redirect("/utilisateur?error=ID%20utilisateur%20requis");
  }
  
  try {
    const deleted = await deleteUser(id);
    
    if (!deleted) {
      redirect(`/utilisateur/${id}?error=Utilisateur%20non%20trouv%C3%A9`);
    }
    
    revalidatePath("/utilisateur");
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    redirect(`/utilisateur/${id}?error=Erreur%20lors%20de%20la%20suppression`);
  }
  
  redirect("/utilisateur");
}
