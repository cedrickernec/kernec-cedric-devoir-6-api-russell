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

  if (catwayNumber === undefined || catwayNumber === null) {
    throw ApiError.badRequest("Numéro de catway invalide.");
  }

  const num = Number(catwayNumber);

  if (!Number.isInteger(num) || String(catwayNumber).trim() === "") {
    throw ApiError.badRequest("Numéro de catway invalide.");
  }

  return num;
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
    throw ApiError.badRequest(`${label} invalide.`);
  }

  return id;
}