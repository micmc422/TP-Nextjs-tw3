/**
 * Modèle User - Gestion des utilisateurs pour l'authentification
 * 
 * Ce fichier définit le schéma et les opérations CRUD pour les utilisateurs.
 * Il sera utilisé pour introduire les concepts d'authentification web.
 * 
 * Concepts clés pour les étudiants :
 * - Définition de types TypeScript pour les documents MongoDB
 * - Opérations CRUD (Create, Read, Update, Delete)
 * - Gestion des mots de passe (à implémenter avec bcrypt)
 * - Index uniques pour l'email
 */

import { ObjectId, WithId } from 'mongodb';
import { getCollection } from './mongodb-client';

/**
 * Interface représentant un utilisateur dans la base de données
 * 
 * Note pour l'authentification future :
 * - Le mot de passe doit être hashé avec bcrypt avant stockage
 * - Ajouter des champs comme 'emailVerified', 'resetToken', etc.
 */
export interface User {
  _id?: ObjectId;
  email: string;
  name: string;
  password?: string; // Hashé avec bcrypt en production
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type pour la création d'un utilisateur (sans _id et dates)
 */
export type CreateUserInput = Omit<User, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * Type pour la mise à jour d'un utilisateur
 */
export type UpdateUserInput = Partial<Omit<User, '_id' | 'createdAt' | 'updatedAt'>>;

/**
 * Nom de la collection des utilisateurs
 */
const COLLECTION_NAME = 'users';

/**
 * Normalise un email (minuscules + trim)
 * 
 * @param email - L'email à normaliser
 * @returns L'email normalisé
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Récupère la collection des utilisateurs
 */
async function getUsersCollection() {
  return getCollection<User>(COLLECTION_NAME);
}

/**
 * Initialise la collection avec les index nécessaires
 * 
 * À appeler au démarrage de l'application pour créer les index
 */
export async function initializeUsersCollection(): Promise<void> {
  const collection = await getUsersCollection();
  // Index unique sur l'email pour éviter les doublons
  await collection.createIndex({ email: 1 }, { unique: true });
  // Index pour améliorer les recherches par nom
  await collection.createIndex({ name: 1 });
}

/**
 * Crée un nouvel utilisateur
 * 
 * @param input - Les données de l'utilisateur à créer
 * @returns L'utilisateur créé avec son _id
 * @throws Error si l'email existe déjà
 * 
 * Note : En production, hasher le mot de passe avant d'appeler cette fonction
 */
export async function createUser(input: CreateUserInput): Promise<WithId<User>> {
  const collection = await getUsersCollection();
  const now = new Date();

  const user: User = {
    ...input,
    email: normalizeEmail(input.email),
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(user);
  return { ...user, _id: result.insertedId };
}

/**
 * Trouve un utilisateur par son ID
 * 
 * @param id - L'ID de l'utilisateur (string ou ObjectId)
 * @returns L'utilisateur (sans mot de passe) ou null s'il n'existe pas
 */
export async function findUserById(id: string | ObjectId): Promise<WithId<User> | null> {
  const collection = await getUsersCollection();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  return collection.findOne({ _id: objectId }, { projection: { password: 0 } });
}

/**
 * Trouve un utilisateur par son email
 * 
 * @param email - L'email de l'utilisateur
 * @returns L'utilisateur ou null s'il n'existe pas
 * 
 * Utile pour l'authentification et la vérification d'email unique
 */
export async function findUserByEmail(email: string): Promise<WithId<User> | null> {
  const collection = await getUsersCollection();
  return collection.findOne({ email: normalizeEmail(email) });
}

/**
 * Liste tous les utilisateurs avec pagination
 * 
 * @param limit - Nombre d'utilisateurs par page (défaut: 20)
 * @param skip - Nombre d'utilisateurs à ignorer (défaut: 0)
 * @returns Liste des utilisateurs
 */
export async function listUsers(limit = 20, skip = 0): Promise<WithId<User>[]> {
  const collection = await getUsersCollection();
  return collection
    .find({}, { projection: { password: 0 } }) // Exclut le mot de passe
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

/**
 * Met à jour un utilisateur
 * 
 * @param id - L'ID de l'utilisateur
 * @param input - Les champs à mettre à jour
 * @returns L'utilisateur mis à jour ou null s'il n'existe pas
 */
export async function updateUser(
  id: string | ObjectId,
  input: UpdateUserInput
): Promise<WithId<User> | null> {
  const collection = await getUsersCollection();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;

  const result = await collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        ...input,
        updatedAt: new Date()
      }
    },
    { returnDocument: 'after' }
  );

  return result;
}

/**
 * Supprime un utilisateur
 * 
 * @param id - L'ID de l'utilisateur
 * @returns true si l'utilisateur a été supprimé, false sinon
 */
export async function deleteUser(id: string | ObjectId): Promise<boolean> {
  const collection = await getUsersCollection();
  const objectId = typeof id === 'string' ? new ObjectId(id) : id;
  const result = await collection.deleteOne({ _id: objectId });
  return result.deletedCount === 1;
}

/**
 * Compte le nombre total d'utilisateurs
 * 
 * @returns Le nombre total d'utilisateurs
 */
export async function countUsers(): Promise<number> {
  const collection = await getUsersCollection();
  return collection.countDocuments();
}
