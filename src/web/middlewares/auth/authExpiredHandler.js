/**
 * AUTH - EXPIRED SESSION HANDLER
 * =========================================================================================
 * Gère l'expiration d'authentification détectée côté API.
 *
 * - Vérifie si la réponse API contient authExpired = true
 * - Détruit la session locale
 * - Supprime le cookie de session
 * - Redirige vers la page de connexion
 *
 * @function handleAuthExpired
 *
 * @param {Object|null|undefined} apiResponse - Résultat retourné par apiFetch
 * @param {boolean} apiResponse.authExpired
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.session
 *
 * @param {Object} res - Réponse Express
 *
 * @returns {boolean} true si une redirection a été déclenchée
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