/**
 * ===================================================================
 * API ERROR HANDLER
 * ===================================================================
 * - Centralise la gestion des erreurs API côté web
 * - Gère :
 *          → AJAX vs HTML
 *          → password_required
 *          → invalid_password
 *          → erreurs classiques
 * ===================================================================
 */

/**
 * Handler centralisé des erreurs API côté Web.
 *
 * - Retourne true si aucune erreur API n'est détectée
 * - Gère les cas spéciaux liés à la suppression protégée par mot de passe
 * - Adapte la réponse selon le contexte AJAX (JSON) ou HTML (render)
 *
 * Cas gérés via apiResponse.context.reason :
 * - "password_required" : renvoie 409 + JSON (needPassword)
 * - "invalid_password"  : renvoie 401 + JSON
 * - autres erreurs       : AJAX => 500 JSON, sinon => 500 render
 *
 * @function handleApiError
 *
 * @param {Object} apiResponse - Réponse normalisée issue de apiFetch
 * @param {boolean} apiResponse.success
 * @param {string} [apiResponse.message]
 * @param {Object} [apiResponse.context]
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.headers
 *
 * @param {Object} res - Réponse Express
 *
 * @returns {boolean} - true si on peut continuer, false si une réponse a été envoyée
 */
export function handleApiError(apiResponse, req, res) {

    // Si pas d’erreur → on continue normalement
    if (apiResponse.success !== false) {
        return true;
    }

    const isAjax = req.headers.accept?.includes("application/json");
    const detail = apiResponse.context;

    // CAS 1 : PASSWORD REQUIRED
    if (detail?.reason === "password_required") {
        res.status(409).json({
            success: false,
            needPassword: true,
            message: apiResponse.message,
            context: detail
        });
        return false;
    }

    // CAS 2 : PASSWORD INCORRECT
    if (detail?.reason === "invalid_password") {
        res.status(401).json({
            success: false,
            message: apiResponse.message,
            context: detail
        });
        return false;
    }

    // CAS 3 : AUTRES ERREURS EN MODE AJAX
    if (isAjax) {
        res.status(500).json({
            success: false,
            message: apiResponse.message
        });
        return false;
    }

    // CAS 4 : ERREUR EN MODE HTML CLASSIQUE
    res.status(500).render("errors/error", {
        message: apiResponse.message
    });

    return false;
}