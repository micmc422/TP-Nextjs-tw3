/**
 * Client MongoDB - Package partagé du Monorepo
 * 
 * Ce fichier définit un client MongoDB pour interagir avec une base de données MongoDB.
 * Il est organisé comme un package réutilisable dans le monorepo (@workspace/database).
 * 
 * Concepts clés pour les étudiants :
 * - Connexion à MongoDB avec le driver officiel
 * - Pattern Singleton pour gérer une seule connexion
 * - Utilisation de variables d'environnement pour la configuration
 * - Gestion des erreurs de connexion
 * 
 * Configuration :
 * - MONGODB_URI : URL de connexion à MongoDB (défaut: mongodb://localhost:27017)
 * - MONGODB_DB_NAME : Nom de la base de données (défaut: tp-nextjs)
 */

import { MongoClient, Db, Collection, Document } from 'mongodb';

// URL de connexion MongoDB par défaut (local avec Docker)
const MONGODB_URI = process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017';
// Nom de la base de données par défaut
const MONGODB_DB_NAME = process.env['MONGODB_DB_NAME'] ?? 'tp-nextjs';

/**
 * Variable globale pour stocker la promesse de connexion
 * Évite de créer plusieurs connexions en développement avec le hot reload
 */
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Options de connexion MongoDB
 */
const options = {};

/**
 * Récupère ou crée une connexion MongoDB
 * 
 * @returns Promise avec le client MongoDB connecté
 * @throws Error si la connexion échoue
 * 
 * Note : Cette fonction utilise un pattern singleton pour réutiliser
 * la même connexion dans toute l'application
 */
export async function getMongoClient(): Promise<MongoClient> {
  if (!clientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

/**
 * Récupère la base de données principale
 * 
 * @returns Promise avec l'instance de la base de données
 */
export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(MONGODB_DB_NAME);
}

/**
 * Récupère une collection typée de la base de données
 * 
 * @template T - Le type des documents de la collection (doit étendre Document)
 * @param name - Le nom de la collection
 * @returns Promise avec la collection typée
 * 
 * Exemple d'utilisation :
 * ```typescript
 * const users = await getCollection<User>('users');
 * const user = await users.findOne({ email: 'test@example.com' });
 * ```
 */
export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDatabase();
  return db.collection<T>(name);
}

/**
 * Ferme la connexion MongoDB
 * 
 * À utiliser lors de l'arrêt de l'application pour libérer les ressources
 */
export async function closeConnection(): Promise<void> {
  if (clientPromise) {
    const client = await clientPromise;
    await client.close();
    clientPromise = null;
  }
}

/**
 * Vérifie la connexion à MongoDB
 * 
 * @returns Promise<boolean> - true si la connexion est établie
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await getMongoClient();
    await client.db().admin().ping();
    return true;
  } catch {
    return false;
  }
}

/**
 * Type exporté pour le client MongoDB
 */
export type { MongoClient, Db, Collection };
