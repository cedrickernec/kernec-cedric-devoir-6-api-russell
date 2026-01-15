/**
 * --------------------------------------------------------------------
 * Gestionnaires d'erreurs globales (API)
 * --------------------------------------------------------------------
 * - Gestion des erreurs 404
 * - Gestion centralisée des erreurs
 */

// ==================================================
// 404 - ROAD NOT FOUND
// ==================================================

export const apiNotFoundHandler = (req, res) => {
    res.status(404).json({
        success: "false",
        error: "Route API introuvable",
        path: req.originalUrl
    });
};

// ==================================================
// GLOBAL ERROR
// ==================================================

export const apiErrorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    const response = {
        success: false,
        error: err.message || "Erreur serveur"
    };

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};