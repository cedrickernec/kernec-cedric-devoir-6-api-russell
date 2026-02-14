/**
 * --------------------------------------------------------------------
 * Gestionnaires d'erreurs globales (WEB)
 * --------------------------------------------------------------------
 * - Gestion des erreurs 404
 * - Gestion centralisée des erreurs
 * - Contrôle de l'UI selon le contexte (public/privé)
 */

// ==================================================
// 404 - PAGE NOT FOUND
// ==================================================

export const webNotFoundHandler = (req, res) => {
    res.status(404).render("errors/404", {
        layout: "layouts/errorLayout",
        title: "Page introuvable"
    });
};

// ==================================================
// GLOBAL ERROR
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