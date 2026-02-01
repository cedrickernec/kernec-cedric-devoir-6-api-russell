import { parseDate } from "../dates/parseDate.js";
import { normalizeDayRange } from "../dates/normalizeDayRange.js";
import { validateReservationPeriod } from "../../validators/reservationValidators.js";

export function parseReservationPeriod(startDate, endDate) {

    const rawStart = parseDate(startDate);
    const rawEnd = parseDate(endDate);

    validateReservationPeriod(rawStart, rawEnd);

    return normalizeDayRange(rawStart, rawEnd);
}