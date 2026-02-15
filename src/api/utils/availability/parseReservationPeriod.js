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

export function parseReservationPeriod(startDate, endDate) {

    const rawStart = parseDate(startDate);
    const rawEnd = parseDate(endDate);

    validateReservationPeriod(rawStart, rawEnd);

    return normalizeDayRange(rawStart, rawEnd);
}

// ===============================================
// UPDATE PERIOD PARSING
// ===============================================

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