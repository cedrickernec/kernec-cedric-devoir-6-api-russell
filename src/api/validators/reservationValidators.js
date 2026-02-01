/**
 * ===================================================================
 * RESERVATION VALIDATORS
 * ===================================================================
 * - Empêche les données invalides d'entrer dans l'application :
 *      - Vérifie la validité des données entrantes
 *      - Contrôle les formats, types et champs obligatoires
 * ===================================================================
 */

import { parseDate } from "../utils/dates/parseDate.js";
import { ApiError } from "../utils/errors/apiError.js";

// Champs obligatoires
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

// Champs obligatoires
export function validateAvailabilityInput(body) {
    const errors = {};
    const { startDate, endDate } = body;
    
    if (!startDate)
        errors.startDate = "Champ obligatoire manquant : Date d'entrée.";

    if (!endDate)
        errors.endDate = "Champ obligatoire manquant : Date de sortie.";

    return errors;
}

// Validation update
export function validateReservationUpdate(cleanData) {
    const errors = {};

    if (cleanData.startDate) {
        try {
            parseDate(cleanData.startDate);
        } catch {
            errors.startDate = "Format de date de début invalide.";
        }
    }

    if (cleanData.endDate) {
        try {
            parseDate(cleanData.endDate);
        } catch {
            errors.endDate = "Format de date de fin invalide.";
        }
    }

    return errors;
}

// Validation cohérence période
export function validateReservationPeriod(start, end) {
    if (!start || !end) {
        throw ApiError.badRequest(
            "Dates de réservation invalides."
        );
    }

    if (start >= end) {
        throw ApiError.validation({
            Dates: "La date de fin doit être strictement postérieure à la date de début (minimum 1 nuit)."
        });
    }
}