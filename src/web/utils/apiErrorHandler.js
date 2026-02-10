/**
 * ===================================================================
 * API ERROR HANDLER
 * ===================================================================
 * Centralise la gestion des erreurs API côté web
 * - Gère AJAX vs HTML
 * - Gère cas password_required
 * - Gère invalid_password
 * - Gère erreurs classiques
 * ===================================================================
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
            message: apiResponse.message
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