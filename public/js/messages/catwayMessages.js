/**
 * CATWAY MESSAGES
 * =========================================================================================
 * @module catwayMessages
 * 
 * Registre centralisé des messages liés aux Catways.
 *
 * Regroupe :
 * - Messages de validation
 * - Messages CRUD
 * - Messages d’erreur métier
 *
 * Certaines clés peuvent être des fonctions dynamiques
 * (ex : BULK_DELETE_SUCCESS).
 *
 * @constant CATWAY_MESSAGES
 * @type {Object}
 *
 * @property {string} CATWAY_REQUIRED
 * @property {string} INVALID_CATWAY
 * @property {string} CATWAY_CONFLICT
 * @property {string} INVALID_TYPE
 * @property {string} STATE_REQUIRED
 *
 * @property {string} CREATE_SUCCESS
 * @property {string} UPDATE_SUCCESS
 * @property {string} DELETE_CONFIRM
 * @property {string} DELETE_SUCCESS
 * @property {(n:number) => string} BULK_DELETE_SUCCESS
 *
 * @property {string} NOT_FOUND
 * @property {string} LOAD_ERROR
 */

export const CATWAY_MESSAGES = {
  // ===== VALIDATION =====
  CATWAY_REQUIRED: "Le numéro du catway est requis.",
  INVALID_CATWAY: "Le numéro du catway doit être un entier supérieur ou égal à 1.",
  CATWAY_CONFLICT: "Ce numéro de catway existe déjà.",
  INVALID_TYPE: "Type de catway invalide.",
  STATE_REQUIRED: "L'état du catway est requis.",

  // ===== CRUD =====
  CREATE_SUCCESS: "Catway créé avec succès.",
  UPDATE_SUCCESS: "Catway modifié avec succès.",
  
  DELETE_CONFIRM: "Supprimer ce catway ?",
  DELETE_SUCCESS: "Catway supprimé.",
  
  BULK_DELETE_SUCCESS: (n) => `${n} catway${n > 1 ? "s" : ""} supprimé${n > 1 ? "s" : ""}.`,

  // ===== ERRORS =====
  NOT_FOUND: "Catway introuvable.",
  LOAD_ERROR: "Erreur lors du chargement du catway.",
}