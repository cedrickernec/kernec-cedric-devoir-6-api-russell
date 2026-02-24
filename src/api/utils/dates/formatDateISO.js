/**
 * ===================================================================
 * DATE FORMATTER - ISO
 * ===================================================================
 * - Convertit une date vers le format YYYY-MM-DD
 * ===================================================================
 */

/**
 * Formate une date au format ISO simplifié (YYYY-MM-DD).
 * Retourne null si la date est absente ou invalide.
 *
 * @function formatDateISO
 *
 * @param {Date|string|null|undefined} date
 *
 * @returns {string|null}
 */
export function formatDateISO(date) {
    
    if (!date) return null;

    const d = new Date(date);

    // Date invalide
    if (Number.isNaN(d.getTime())) return null;

    return d.toISOString().slice(0,10);
}