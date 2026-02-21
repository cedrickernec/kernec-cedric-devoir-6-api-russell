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

export const webNotFoundHandler = (req, res) => {
    res.status(404).render("errors/404", {
        layout: "layouts/errorLayout",
        title: "Page introuvable"
    });
};

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

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