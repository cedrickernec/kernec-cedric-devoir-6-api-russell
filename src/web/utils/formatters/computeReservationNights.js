/**
 * ===================================================================
 * COMPUTE RESERVATION NIGHTS - WEB
 * ===================================================================
 * - Calcul le nombre de nuits entre deux dates
 * - Ignore les dates invalides
 * - Retourne :
 *      - null  → données invalides
 *      - 0     → séjour nul ou incohérent
 *      - n     → nombre de nuits
 * ===================================================================
 */

export function computeNightsBetweenDates(startDate, endDate) {

    // ==================================================
    // GUARD CLAUSES
    // ==================================================

    if (!startDate || !endDate) return null;

    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if(isNaN(start) || isNaN(end)) return null;

    // ==================================================
    // DATE DIFFERENCE
    // ==================================================

    const diff = end - start;

    // Sécurité : fin avant début
    if (diff <= 0) return 0;

    // Conversion millisecondes en nuit(s)
    const result = Math.round(diff / DAY_IN_MS);

    return result;
}