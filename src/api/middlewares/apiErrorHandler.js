/**
 * API ERROR HANDLERS
 * =========================================================================================
 * @module apiErrorHandler
 *
 * Middlewares de gestion des erreurs pour l’API.
 *
 * Responsabilités :
 * - Gérer les routes API non trouvées (404)
 * - Centraliser la transformation des erreurs en réponse JSON normalisée
 *
 * Déclenché par :
 * - Fin de chaîne middleware Express
 *
 * Dépendances :
 * - ApiError (erreurs métier personnalisées)
 *
 * Sécurité :
 * - Masque les détails internes en production
 * - Expose la stack uniquement en environnement development
 *
 * Effets de bord :
 * - Retourne une réponse JSON normalisée
 */

/**
 * API NOT FOUND HANDLER
 * =========================================================================================
 * Middleware 404 pour les routes API non trouvées.
 *
 * @function apiNotFoundHandler
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {void}
 */

export const apiNotFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: "Route API introuvable.",
        path: req.originalUrl
    });
};

/**
 * API ERROR HANDLER
 * =========================================================================================
 * Middleware global de gestion centralisée des erreurs.
 *
 * Transforme une ApiError (ou erreur standard) en réponse JSON normalisée.
 *
 * @function apiErrorHandler
 *
 * @param {Error} err - Erreur capturée
 * @param {Object} req
 * @param {Object} res
 * @param {Function} _next
 *
 * @returns {void}
 */

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