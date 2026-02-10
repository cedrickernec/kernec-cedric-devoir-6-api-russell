/**
 * ===================================================================
 * COMPUTE RESERVATION NIGHTS
 * ===================================================================
 * - Calcul le nombre de nuits entre deux dates
 * ===================================================================
 */

export function computeNightsBetweenDates(startDate, endDate) {
    if (!startDate || !endDate) return null;

    const DAY = 1000 * 60 * 60 * 24;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if(isNaN(start) || isNaN(end)) return null;

    const diff = end - start;

    if (diff <= 0) return 0;

    const result = Math.round(diff / DAY);

    return result;
}