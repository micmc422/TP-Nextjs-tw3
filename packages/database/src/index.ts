/**
 * @workspace/database - Package de base de données MongoDB
 * 
 * Ce package fournit un client MongoDB et des modèles pour gérer les données
 * de l'application. Il est conçu pour fonctionner avec une instance MongoDB
 * locale via Docker.
 * 
 * Exports principaux :
 * - Client MongoDB : connexion et utilitaires de base de données
 * - User : modèle utilisateur pour l'authentification
 */

// Export du client MongoDB
export {
  getMongoClient,
  getDatabase,
  getCollection,
  closeConnection,
  checkConnection,
} from './mongodb-client.js';

// Export du modèle User et ses types
export {
  createUser,
  findUserById,
  findUserByEmail,
  listUsers,
  updateUser,
  deleteUser,
  countUsers,
  initializeUsersCollection,
} from './user.js';

export type {
  User,
  CreateUserInput,
  UpdateUserInput,
} from './user.js';

// Export de ObjectId pour la validation des IDs
export { ObjectId } from 'mongodb';
