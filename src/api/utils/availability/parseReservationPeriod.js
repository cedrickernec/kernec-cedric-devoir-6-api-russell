/**
 * ===================================================================
 * RESERVATION PERIOD PARSER
 * ===================================================================
 * - Parse et valide une période de réservation
 * - Normalise les dates au format jour (début / fin)
 * ===================================================================
 */

import { parseDate } from "../dates/parseDate.js";
import { normalizeDayRange } from "../dates/normalizeDayRange.js";
import { validateReservationPeriod } from "../../validators/reservationValidators.js";

// ===============================================
// CREATE PERDIODE PARSING
// ===============================================
/**
 * Parse et valide une période de réservation (création).
 *
 * Convertit les dates brutes en Date, valide la cohérence
 * puis normalise au format début/fin de journée.
 *
 * @function parseReservationPeriod
 *
 * @param {string|Date} startDate
 * @param {string|Date} endDate
 *
 * @returns {{start: Date, end: Date}}
 *
 * @throws {ApiError} 400 - Période invalide
 */
export function parseReservationPeriod(startDate, endDate) {

    const rawStart = parseDate(startDate);
    const rawEnd = parseDate(endDate);

    validateReservationPeriod(rawStart, rawEnd);

    return normalizeDayRange(rawStart, rawEnd);
}

// ===============================================
// UPDATE PERIOD PARSING
// ===============================================
/**
 * Parse et valide une période de réservation lors d'une mise à jour.
 * Conserve les dates existantes si aucune nouvelle valeur fournie.
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
 * @throws {ApiError} 400 - Période invalide
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