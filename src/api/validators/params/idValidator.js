/**
 * ID VALIDATOR
 * =========================================================================================
 * @module idValidator
 *
 * Validation des identifiants transmis via les routes.
 *
 * Objectifs :
 * - Empêcher les identifiants invalides d’atteindre la couche service
 * - Normaliser les entrées (ex: numéro → Number)
 *
 * Stratégie :
 * - Erreur immédiate via ApiError (400) en cas d’entrée invalide
 */

import mongoose from "mongoose";
import { ApiError } from "../../utils/errors/apiError.js";


/**
 * VALIDATE CATWAY NUMBER
 * =========================================================================================
 * Valide et normalise un numéro de catway.
 *
 * @function validateCatwayNumber
 *
 * @param {string|number} catwayNumber Numéro brut (params/query)
 *
 * @returns {number} Numéro normalisé
 *
 * @throws {ApiError} 400 Numéro invalide
 */

export function validateCatwayNumber(catwayNumber) {

  if (isNaN(catwayNumber)) {
    throw new ApiError(400, "Numéro de catway invalide.");
  }

  return Number(catwayNumber);
}

/**
 * VALIDATE MONGODB OBJECT ID
 * =========================================================================================
 * Valide un identifiant MongoDB de type ObjectId.
 *
 * @function validateObjectId
 *
 * @param {string} id Identifiant brut
 * @param {string} [label="Identifiant"] Libellé personnalisé utilisé dans le message d’erreur
 *
 * @returns {string} Identifiant validé (inchangé)
 *
 * @throws {ApiError} 400 Identifiant invalide
 */

export function validateObjectId(id, label = "Identifiant") {
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${label} invalide.`);
  }

  return id;
}