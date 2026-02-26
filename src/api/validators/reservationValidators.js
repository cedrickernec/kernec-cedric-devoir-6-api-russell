/**
 * RESERVATION VALIDATORS
 * =========================================================================================
 * @module reservationValidators
 *
 * Validation des données Reservation + requêtes de disponibilité.
 *
 * Stratégie :
 * - validateReservationCreate / validateAvailabilityInput : “soft”
 *   → retourne un objet `errors`
 * - validateReservationPeriod : “hard”
 *   → throw ApiError si la période est incohérente
 */

import { ApiError } from "../utils/errors/apiError.js";

/**
 * VALIDATE RESERVATION CREATE
 * =========================================================================================
 * Valide les champs obligatoires pour la création d’une réservation.
 *
 * Champs requis :
 * - clientName
 * - boatName
 * - startDate
 * - endDate
 *
 * @function validateReservationCreate
 *
 * @param {Object} body Données filtrées (cleanData)
 *
 * @returns {Object} errors Erreurs par champ (vide si OK)
 */

export function validateReservationCreate(body) {
    const errors = {};
    const { clientName, boatName, startDate, endDate } = body;

    if (!clientName)
        errors.clientName = "Champ obligatoire manquant : Nom du client.";

    if (!boatName)
        errors.boatName = "Champ obligatoire manquant : Nom du bateau.";

    if (!startDate)
        errors.startDate = "Champ obligatoire manquant : Date d'entrée.";

    if (!endDate)
        errors.endDate = "Champ obligatoire manquant : Date de sortie.";

    return errors;
}

/**
 * VALIDATE AVAILABILITY INPUT
 * =========================================================================================
 * Valide les champs obligatoires pour une requête de disponibilité.
 *
 * Champs requis :
 * - startDate
 * - endDate
 *
 * @function validateAvailabilityInput
 *
 * @param {Object} body Données filtrées (cleanData)
 *
 * @returns {Object} errors Erreurs par champ (vide si OK)
 */

export function validateAvailabilityInput(body) {
    const errors = {};
    const { startDate, endDate } = body;
    
    if (!startDate)
        errors.startDate = "Champ obligatoire manquant : Date d'entrée.";

    if (!endDate)
        errors.endDate = "Champ obligatoire manquant : Date de sortie.";

    return errors;
}

/**
 * VALIDATE RESERVATION PERIOD
 * =========================================================================================
 * Vérifie la cohérence d’une période de réservation.
 *
 * Règles :
 * - start et end doivent exister
 * - start < end (minimum 1 nuit)
 *
 * @function validateReservationPeriod
 *
 * @param {Date} start Date de début (déjà parsée)
 * @param {Date} end Date de fin (déjà parsée)
 *
 * @throws {ApiError} 400 Période invalide
 */

export function validateReservationPeriod(start, end) {
    if (!start || !end) {
        throw ApiError.badRequest(
            "Dates de réservation ou formats invalides."
        );
    }

    if (start >= end) {
        throw ApiError.validation({
            Dates: "La date de fin doit être strictement postérieure à la date de début (minimum 1 nuit)."
        });
    }
}