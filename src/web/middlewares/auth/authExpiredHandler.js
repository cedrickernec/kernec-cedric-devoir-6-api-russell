/**
 * ===================================================================
 * AUTH - EXPIRED SESSION HANDLER
 * ===================================================================
 * - Détecte une expiration d'authentification côté API
 * - Détruit la session locale
 * - Nettoie le cookie de session
 * - Redirige vers la page de connexion
 * ===================================================================
 */

export function handleAuthExpired(apiResponse, req, res) {

    // ==================================================
    // AUTH EXPIRATION CHECK
    // ==================================================

    if (!apiResponse || apiResponse.authExpired !== true) {
        return false;
    }

    // ==================================================
    // SESSION CLEANUP
    // ==================================================

    req.session.destroy(() => {
        res.clearCookie("russell.sid");
        res.redirect("/");
    });

    return true
}