/**
 * REQUEST BODY FILTER
 * =========================================================================================
 * @module pickAllowedFields
 *
 * Filtre strict d’un body de requête.
 *
 * Objectifs :
 * - Appliquer une “liste blanche” de champs autorisés côté contrôleur
 * - Bloquer toute tentative d’injection de propriété (mass assignment)
 *
 * Comportement :
 * - Si un champ non autorisé est présent → throw ApiError(400)
 * - Sinon, renvoie un objet ne contenant que les champs autorisés
 */

import { ApiError } from "./apiError.js";

/**
 * PICK ALLOWED FIELDS
 * =========================================================================================
 * Filtre un body en ne conservant que les champs autorisés.
 *
 * @function pickAllowedFields
 *
 * @param {Object} body Données reçues (req.body)
 * @param {Array<string>} allowedFields Liste blanche des champs autorisés
 *
 * @returns {Object} Objet filtré
 *
 * @throws {ApiError} 400 Champs non autorisés détectés
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