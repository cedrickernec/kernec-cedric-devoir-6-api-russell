/**
 * ===================================================================
 * ID VALIDATOR
 * ===================================================================
 * - Empêche les identifiants invalide d'atteindre les services :
 *    - Valide les identifiant transmis dans les routes
 * ===================================================================
 */

import mongoose from "mongoose";
import { ApiError } from "../../utils/errors/apiError.js";

// ===============================================
// VALIDATE CATWAY NUMBER
// ===============================================
/**
 * Valide et normalise un numéro de catway.
 *
 * @function validateCatwayNumber
 *
 * @param {string|number} catwayNumber
 *
 * @returns {number}
 *
 * @throws {ApiError} 400 - Numéro invalide
 */
export function validateCatwayNumber(catwayNumber) {

  if (isNaN(catwayNumber)) {
    throw new ApiError(400, "Numéro de catway invalide.");
  }

  return Number(catwayNumber);
}

// ===============================================
// VALIDATE MONGODB OBJECT ID
// ===============================================
/**
 * Valide un identifiant MongoDB ObjectId.
 *
 * @function validateObjectId
 *
 * @param {string} id
 * @param {string} [label="Identifiant"] - Libellé personnalisé pour le message d'erreur
 *
 * @returns {string}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 */
export function validateObjectId(id, label = "Identifiant") {
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${label} invalide.`);
  }

  return id;
}