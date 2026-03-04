/**
 * DATE & TIME FORMATTER (FR)
 * =========================================================================================
 * @module dateFormatter
 * 
 * Fonctions utilitaires de formatage des dates et heures.
 * 
 * - Centralise le formatage des dates/heures UI
 * - Sécurise les entrées invalides
 * - Garantit une cohérence d'affichage globale
 */

/**
 * SHORT DATE (JJ/MM/AAAA)
 * =========================================================================================
 * Formate une date au format français court (JJ/MM/AAAA).
 *
 * Sécurités :
 * - Retourne "-" si la valeur est absente
 * - Retourne "-" si la date est invalide
 *
 * @function formatDateFR
 * 
 * @param {Date|string|null} date
 *
 * @returns {string}
 */

export function formatDateFR(date) {
    if (!date) return "-";

    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

/**
 * TIME (HH:MM:SS)
 * =========================================================================================
 * Formate une date au format heure française (HH:MM:SS).
 *
 * Sécurités :
 * - Retourne "-" si la valeur est absente
 * - Retourne "-" si la date est invalide
 *
 * @function formatTimeFR
 * 
 * @param {Date|string|null} date
 *
 * @returns {string}
 */

export function formatTimeFR(date) {
    if (!date) return "-";

    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}