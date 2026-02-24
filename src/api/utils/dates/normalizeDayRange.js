/**
 * ===================================================================
 * NORMALIZE DAY RANGE
 * ===================================================================
 * Fournir un intervalle de dates cohérent :
 *      - Normalise la date de début et de fin d'une réservation
 *      - Prépare les dates avant calcul de conflit
 *      - Garantit une comparaison fiable entre périodes
 * ===================================================================
 */

/**
 * Normalise un intervalle de dates.
 *
 * @function normalizeDayRange
 *
 * @param {Date} startDate
 * @param {Date} endDate
 *
 * @returns {{ start: Date, end: Date }}
 */
export const normalizeDayRange = (startDate, endDate) => {

    return { start: startDate, end: endDate };
};