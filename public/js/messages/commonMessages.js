/**
 * COMMON MESSAGES
 * =========================================================================================
 * @module commonMessages
 * 
 * Registre centralisé des messages génériques réutilisables dans l'application.
 *
 * Utilisés pour :
 * - Erreurs serveur
 * - Suppressions génériques
 * - Messages système globaux
 *
 * @constant COMMON_MESSAGES
 * @type {Object}
 *
 * @property {string} SERVER_ERROR_SHORT
 * @property {string} SERVER_ERROR_LONG
 * @property {string} INVALID_REQUEST
 * @property {string} LOAD_ERROR
 *
 * @property {string} DELETE_CONFIRM
 * @property {string} DELETE_SUCCESS
 * @property {string} DELETE_CANCEL
 * @property {string} DELETE_ERROR
 */

export const COMMON_MESSAGES = {
  SERVER_ERROR_SHORT: "Erreur serveur.",
  SERVER_ERROR_LONG: "Erreur serveur. Veuillez réessayer ultérieurement.",

  INVALID_REQUEST: "Requête invalide.",
  LOAD_ERROR: "Erreur lors du chargement.",

  DELETE_CONFIRM: "Confirmer la suppression ?",
  DELETE_SUCCESS: "Suppression effectuée.",
  DELETE_CANCEL: "Opération annulée.",
  DELETE_ERROR: "Erreur lors de la suppression.",
}