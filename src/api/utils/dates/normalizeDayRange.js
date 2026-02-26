/**
 * NORMALIZE DAY RANGE
 * =========================================================================================
 * @module normalizeDayRange
 *
 * Normalise un intervalle de dates pour garantir des comparaisons fiables.
 *
 * Remarque :
 * - Ici, la fonction renvoie simplement {start, end} tel quel.
 * - Si tu veux vraiment “normaliser” (début/fin de journée), c’est ici que ça devrait vivre.
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */

/**
 * NORMALIZE DAY RANGE
 * =========================================================================================
 * Retourne un intervalle {start, end}.
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