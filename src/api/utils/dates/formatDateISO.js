/**
 * DATE FORMATTER - ISO
 * =========================================================================================
 * @module formatDateISO
 *
 * Convertit une date (Date ou valeur convertible) vers le format ISO simplifié YYYY-MM-DD.
 *
 * Comportements :
 * - Retourne null si la date est absente ou invalide
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */

/**
 * FORMAT DATE ISO
 * =========================================================================================
 * Formate une date au format YYYY-MM-DD.
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