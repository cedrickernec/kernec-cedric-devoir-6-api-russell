/**
 * ===================================================================
 * FORMAT API ERRORS
 * ===================================================================
 * - Normalise les erreurs renvoyées par l'API
 *   pour correspondre au format attendu par les vues
 * ===================================================================
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