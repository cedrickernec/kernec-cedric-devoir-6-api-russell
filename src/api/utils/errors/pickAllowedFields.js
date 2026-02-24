/**
 * ===================================================================
 * REQUEST BODY FILTER
 * ===================================================================
 * - Autorise uniquement certains champs dans une requête
 * - Bloque toute tentative d'injection de propriété
 * ===================================================================
 * Sécurise les entrées utilisateur côté contrôleur
 * ===================================================================
 */

import { ApiError } from "./apiError.js";

/**
 * Filtre un body de requête en ne conservant que les champs autorisés.
 * Lance une erreur si des champs non autorisés sont détectés.
 *
 * @function pickAllowedFields
 *
 * @param {Object} body - Données reçues dans la requête
 * @param {Array<string>} allowedFields - Liste blanche des champs autorisés
 *
 * @returns {Object} - Objet filtré ne contenant que les champs autorisés
 *
 * @throws {ApiError} 400 - Champs non autorisés détectés
 */
export const pickAllowedFields = (body, allowedFields) => {
  const receivedFields = Object.keys(body);

  // ===============================================
  // FIELD VALIDATION
  // ===============================================

  const invalidFields = receivedFields.filter(
    field => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new ApiError(
      400,
      `Champ(s) non autorisé(s) : ${invalidFields.join(", ")}.`
    );
  }

  // ===============================================
  // FILTERED OUTPUT
  // ===============================================

  // Retourner seulement les champs autorisés
  return Object.fromEntries(
    Object.entries(body).filter(([key]) =>
      allowedFields.includes(key)
    )
  );
};