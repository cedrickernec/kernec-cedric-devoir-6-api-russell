/**
 * USER MESSAGES
 * =========================================================================================
 * @module userMessages
 * 
 * Registre centralisé des messages liés aux Utilisateurs.
 *
 * Regroupe :
 * - Validation sécurité (email, password)
 * - Messages CRUD
 * - Messages d’erreur métier
 * 
 * Certaines clés peuvent être des fonctions dynamiques
 * (ex : BULK_DELETE_SUCCESS).
 * 
 * @constant USER_MESSAGES
 * @type {Object}
 *
 * @property {string} EMAIL_CONFLICT
 * @property {string} INVALID_PASSWORD
 * @property {string} PASSWORD_CONFLICT
 *
 * @property {string} CREATE_SUCCESS
 * @property {string} UPDATE_SUCCESS
 * @property {string} PASSWORD_UPDATE_SUCCESS
 *
 * @property {string} DELETE_CONFIRM
 * @property {string} DELETE_SUCCESS
 * @property {(n:number) => string} BULK_DELETE_SUCCESS
 *
 * @property {string} NOT_FOUND
 * @property {string} LOAD_ERROR
 */

export const USER_MESSAGES = {
  // ===== VALIDATION =====
  EMAIL_CONFLICT: "Cet email est déjà utilisé par un autre utilisateur.",
  INVALID_PASSWORD: "Le mot de passe ne respecte pas les règles de sécurité.",
  PASSWORD_CONFLICT: "Le nouveau mot de passe doit être différent de l'ancien.",

  // ===== CRUD =====
  CREATE_SUCCESS: "Utilisateur créé avec succès.",
  UPDATE_SUCCESS: "Utilisateur modifié avec succès.",
  PASSWORD_UPDATE_SUCCESS: "Mot de passe utilisateur modifié avec succès.",
  
  DELETE_CONFIRM: "Supprimer cet utilisateur ?",
  DELETE_SUCCESS: "Utilisateur supprimé.",
  
  BULK_DELETE_SUCCESS: (n) => `${n} utilisateur${n > 1 ? "s" : ""} supprimé${n > 1 ? "s" : ""}.`,

  // ===== ERRORS =====
  NOT_FOUND: "Utilisateur introuvable.",
  LOAD_ERROR: "Erreur lors du chargement de l'utilisateur.",
}