/**
 * PARSE COMPOSITE IDS
 * =========================================================================================
 * @module parseCompositeIds
 *
 * Sécurise les entrées de type identifiant composite (catway|reservation).
 *
 * Fonctionnalités :
 * - Validation des composants individuels (catwayNumber, reservationId)
 * - Retourne un tableau d'objets avec les deux composants validés
 *
 * Dépendances :
 * - ApiError (erreurs normalisées)
 * - validateCatwayNumber, validateObjectId (validation des composants)
 *
 * Sécurité :
 * - Rejette toute entrée non conforme (validation stricte)
 *
 * Effets de bord :
 * - Peut lever une ApiError en cas de format invalide
 */

import {
    validateCatwayNumber,
    validateObjectId
} from "../../validators/params/idValidator.js";

import { ApiError } from "../errors/apiError.js";

/**
 * PARSE COMPOSITE IDS
 * =========================================================================================
 * Parse et valide une liste d'identifiants composites
 * au format "catwayNumber|reservationId".
 *
 * @function parseCompositeIds
 *
 * @param {Array<string>} ids Liste d'identifiants composites
 *
 * @returns {Array<Object>} Liste d'objets avec les deux composants validés
 *
 * @throws {ApiError} 400 Format d'identifiant composite invalide
 */

export function parseCompositeIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw ApiError.badRequest("Requête invalide.");
  }

  return ids.map((compositeId) => {

    if (typeof compositeId !== "string") {
      throw ApiError.badRequest("Identifiant composite invalide.", { compositeId });
    }

    const parts = compositeId.split("|");

    if (parts.length !== 2) {
      throw ApiError.badRequest("Identifiant composite invalide.", { compositeId });
    }

    const [rawCatwayNumber, rawReservationId] = parts;

    if (!rawCatwayNumber || !rawReservationId) {
      throw ApiError.badRequest("Identifiant composite invalide.", { compositeId });
    }

    return {
      catwayNumber: validateCatwayNumber(rawCatwayNumber.trim()),
      reservationId: validateObjectId(rawReservationId.trim(), "Identifiant réservation")
    };
  });
}