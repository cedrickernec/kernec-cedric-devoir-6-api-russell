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