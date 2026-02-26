/**
 * FORMAT API ERRORS MODULE (WEB)
 * =========================================================================================
 * @module formatApiErrors
 *
 * Normalise les erreurs API pour correspondre au format attendu par les vues Web.
 *
 * Responsabilités :
 * - Reformater les erreurs de champ
 * - Adapter le champ password si nécessaire
 */

/**
 * FORMAT API ERRORS
 * =========================================================================================
 * Reformate les erreurs issues de l’API.
 *
 * @function formatApiErrors
 *
 * @param {Object} apiData
 *
 * @returns {Object}
 */

export function formatApiErrors(apiData) {

    const errors = apiData.errors || {};
    const formatted = { ...errors };

    // Cas spécifique du password
    if (errors.password) {
        formatted.password = {
            message: "Mot de passe invalide.",
            errors: errors.password
        };
    }

    return formatted;
}