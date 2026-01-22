/**
 * ===================================================================
 * API ERROR HANDLERS
 * ===================================================================
 * - Gestion des erreurs 404
 * - Gestion centralisée des erreurs globales
 * ===================================================================
 */

export const apiNotFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
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
        error: status === 500
          ? "Erreur serveur"
          : err.message
    };

    if (err.details) {
        response.details = err.details;
    }

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};