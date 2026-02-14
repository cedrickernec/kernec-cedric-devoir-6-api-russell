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
        error: "Route API introuvable.",
        path: req.originalUrl
    });
};

// ==================================================
// GLOBAL ERROR
// ==================================================

export const apiErrorHandler = (err, req, res, _next) => {
    const status = err.status || 500;
    const response =  { success: false };

    if (status === 500) {
        response.message = "Erreur interne du serveur.";
    } else if (err.message) {
        response.message = err.message;
    }

    if (err.detail?.fields && Object.keys(err.detail.fields).length > 0) {
        response.errors = err.detail.fields;
    }

    if (err.detail?.conflictWith) {
        response.conflictWith = err.detail.conflictWith;
    }

    if (err.detail?.context) {
        response.context = err.detail.context;
    }

    if (err.detail &&
        !err.detail.fields &&
        !err.detail.conflictWith &&
        !err.detail.context) {
        response.context = err.detail;
    }

    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};