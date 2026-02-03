import { parseDate } from "../dates/parseDate.js";
import { normalizeDayRange } from "../dates/normalizeDayRange.js";
import { validateReservationPeriod } from "../../validators/reservationValidators.js";

// ===============================================
// PARSE RESERVATION PERDIOD
// ===============================================

export function parseReservationPeriod(startDate, endDate) {

    const rawStart = parseDate(startDate);
    const rawEnd = parseDate(endDate);

    validateReservationPeriod(rawStart, rawEnd);

    return normalizeDayRange(rawStart, rawEnd);
}

// ===============================================
// PARSE RESERVATION UPDATE PERDIOD
// ===============================================

export function parseReservationUpdatePeriod(
    existingStart,
    existingEnd,
    newStartDate,
    newEndDate
) {

    const rawStart = newStartDate
    ? parseDate(newStartDate)
    : existingStart;
    
    const rawEnd = newEndDate
    ? parseDate(newEndDate)
    : existingEnd;
    
    validateReservationPeriod(rawStart, rawEnd);
    
    return normalizeDayRange(rawStart, rawEnd);
}