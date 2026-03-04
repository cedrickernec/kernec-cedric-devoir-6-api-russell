/**
 * RESERVATION PERIOD PARSER
 * =========================================================================================
 * @module parseReservationPeriod
 *
 * Parse, valide et normalise une période de réservation.
 *
 * Fonctionnalités :
 * - Conversion des entrées en Date (via parseDate)
 * - Validation de cohérence de période (via validateReservationPeriod)
 * - Normalisation de l’intervalle (via normalizeDayRange)
 * - Variante update : conserve les dates existantes si non fournies
 *
 * Dépendances :
 * - dates.parseDate
 * - dates.normalizeDayRange
 * - validators.validateReservationPeriod
 *
 * Effets de bord :
 * - Peut lever une ApiError si la période est invalide
 */

import { parseDate } from "../dates/parseDate.js";
import { normalizeDayRange } from "../dates/normalizeDayRange.js";
import { validateReservationPeriod } from "../../validators/reservationValidators.js";

/**
 * PARSE RESERVATION PERIOD (CREATE)
 * =========================================================================================
 * Parse et valide une période de réservation (création).
 *
 * @function parseReservationPeriod
 *
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 *
 * @returns {{start: Date, end: Date}}
 *
 * @throws {ApiError} 400 Période invalide
 */

export function parseReservationPeriod(startDate, endDate) {

    const rawStart = parseDate(startDate);
    const rawEnd = parseDate(endDate);

    validateReservationPeriod(rawStart, rawEnd);

    return normalizeDayRange(rawStart, rawEnd);
}

/**
 * PARSE RESERVATION PERIOD (UPDATE)
 * =========================================================================================
 * Parse et valide une période de réservation (mise à jour).
 * Conserve les dates existantes si aucune nouvelle valeur n’est fournie.
 *
 * @function parseReservationUpdatePeriod
 *
 * @param {Date} existingStart
 * @param {Date} existingEnd
 * @param {string|Date} [newStartDate]
 * @param {string|Date} [newEndDate]
 *
 * @returns {{start: Date, end: Date}}
 *
 * @throws {ApiError} 400 Période invalide
 */

export function parseReservationUpdatePeriod(
    existingStart,
    existingEnd,
    newStartDate,
    newEndDate
) {

    // Utilise la nouvelle date si fournie,
    // sinon conserve l'existante
    const rawStart = newStartDate
    ? parseDate(newStartDate)
    : existingStart;
    
    const rawEnd = newEndDate
    ? parseDate(newEndDate)
    : existingEnd;
    
    validateReservationPeriod(rawStart, rawEnd);
    
    return normalizeDayRange(rawStart, rawEnd);
}