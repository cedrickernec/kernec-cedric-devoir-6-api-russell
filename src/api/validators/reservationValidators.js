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

    if (!clientName || typeof clientName !== "string" || clientName.trim().length === 0)
        errors.clientName = "Champ obligatoire manquant : Nom du client.";

    if (!boatName || typeof boatName !== "string" || boatName.trim().length === 0)
        errors.boatName = "Champ obligatoire manquant : Nom du bateau.";

    if (!startDate)
        errors.startDate = "Champ obligatoire manquant : Date d'entrée.";

    if (!endDate)
        errors.endDate = "Champ obligatoire manquant : Date de sortie.";

    return errors;
}

/**
 * VALIDATE RESERVATION UPDATE
 * =========================================================================================
 * Valide les champs pour la mise à jour d’une réservation.
 * 
 * Champs optionnels (mais non vides si présents) :
 * - clientName
 * - boatName
 * - startDate
 * - endDate
 * 
 * @function validateReservationUpdate
 *
 * @param {Object} body Données filtrées (cleanData)
 * 
 * @return {Object} errors Erreurs par champ (vide si OK)
 */

export function validateReservationUpdate(body) {
    const errors = {};
    const { clientName, boatName, startDate, endDate } = body;

    if ("clientName" in body) {
        if (typeof clientName !== "string" || clientName.trim().length === 0) {
            errors.clientName = "Le nom du client doit être une chaîne de caractères non vide.";
        }
    }

    if ("boatName" in body) {
        if (typeof boatName !== "string" || boatName.trim().length === 0) {
            errors.boatName = "Le nom du bateau doit être une chaîne de caractères non vide.";
        }
    }

    if ("startDate" in body && !startDate)
        errors.startDate = "La date d'entrée ne peut être vide.";

    if ("endDate" in body && !endDate)
        errors.endDate = "La date de sortie ne peut être vide.";

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
            dates: "La date de fin doit être strictement postérieure à la date de début (minimum 1 nuit)."
        });
    }
}