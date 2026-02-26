/**
 * RESERVATION MESSAGES
 * =========================================================================================
 * @reservationMessages
 * 
 * Registre centralisé des messages liés aux Réservations.
 *
 * Inclut :
 * - Validation métier
 * - Messages CRUD
 * - Gestion des conflits de dates
 * 
 * Certaines clés peuvent être des fonctions dynamiques
 * (ex : BULK_DELETE_SUCCESS).
 *
 * @constant RESERVATION_MESSAGES
 * @type {Object}
 *
 * @property {string} CLIENT_REQUIRED
 * @property {string} BOAT_REQUIRED
 * @property {string} DATES_REQUIRED
 * @property {string} INVALID_DATES
 * @property {string} DATE_CONFLICT
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

export const RESERVATION_MESSAGES = {
  // ===== VALIDATION =====
  CLIENT_REQUIRED: "Le nom du client est requis.",
  BOAT_REQUIRED: "Le nom du bateau est requis.",
  DATES_REQUIRED: "Les dates de début et de fin sont requises.",
  INVALID_DATES: "La date de fin doit être postérieure à la date de début.",
  DATE_CONFLICT: "Ce catway est déjà réservé sur cette période.",
  
  // ===== CRUD =====
  CREATE_SUCCESS: "Réservation créée avec succès.",
  UPDATE_SUCCESS: "Réservation modifiée avec succès.",
  
  DELETE_CONFIRM: "Supprimer cette réservation ?",
  DELETE_SUCCESS: "Réservation supprimée.",
  BULK_DELETE_SUCCESS: (n) => `${n} réservation${n > 1 ? "s" : ""} supprimée${n > 1 ? "s" : ""}.`,
  
  // ===== ERRORS =====
  NOT_FOUND: "Réservation introuvable.",
  LOAD_ERROR: "Erreur lors du chargement de la réservation.",
}