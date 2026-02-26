/**
 * WEB API ERROR HANDLER
 * =========================================================================================
 * @module apiErrorHandler
 *
 * Handler centralisé des erreurs API côté Web.
 *
 * Responsabilités :
 * - Interpréter la réponse normalisée issue de apiFetch
 * - Gérer les cas métier spécifiques (password_required, invalid_password)
 * - Adapter la réponse selon le contexte (AJAX ou HTML)
 */

/**
 * HANDLE API ERROR
 * =========================================================================================
 * Analyse une réponse API et gère les erreurs côté Web.
 *
 * @function handleApiError
 *
 * @param {Object} apiResponse - Réponse issue de apiFetch
 * @param {boolean} apiResponse.success
 * @param {string} [apiResponse.message]
 * @param {Object} [apiResponse.context]
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {boolean}
 * - true  → aucune erreur, le contrôleur peut continuer
 * - false → une réponse a déjà été envoyée
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