/**
 * ===================================================================
 * WEB ERROR HANDLERS
 * ===================================================================
 * - Gestion des erreurs 404
 * - Gestion centralisée des erreurs
 * - Adaptation automatique de l'UI selon le contexte
 * ===================================================================
 */

// ==================================================
// 404 HANDLER
// ==================================================
/**
 * Middleware 404.
 *
 * - Intercepte les routes non trouvées
 * - Rend la vue errors/404
 *
 * @function webNotFoundHandler
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {void}
 */
export const webNotFoundHandler = (req, res) => {
    res.status(404).render("errors/404", {
        layout: "layouts/errorLayout",
        title: "Page introuvable"
    });
};

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================
/**
 * Middleware global de gestion des erreurs.
 *
 * - Intercepte les erreurs applicatives
 * - Détermine le code HTTP (500 par défaut)
 * - Adapte l'affichage selon le contexte UI
 * - Rend la vue errors/:status
 *
 * @function webErrorHandler
 *
 * @param {Error} err - Erreur interceptée
 * @param {number} [err.status]
 * @param {Object} [err.ui]
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.session
 *
 * @param {Object} res - Réponse Express
 * @param {Object} res.locals
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
 */
export const webErrorHandler = (err, req, res, _next) => {
    const status = err.status || 500;

    const ui =
    err.ui ||
    res.locals.errorUI || {
        showBack: true,
        showLogout: !!req.session?.user
    };

    res.status(status).render(`errors/${status}`, {
        title: `Erreur ${status}`,
        layout: "layouts/errorLayout",

        showBack: ui.showBack,
        showLogout: ui.showLogout
    });
};