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