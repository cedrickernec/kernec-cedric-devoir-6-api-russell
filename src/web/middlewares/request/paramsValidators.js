/**
 * ROUTE PARAM VALIDATORS
 * =========================================================================================
 * - Valide les paramètres dynamiques des routes
 * - Empêche l'accès aux contrôleurs avec données invalides
 */

/**
 * MONGODB OBJECTID VALIDATION
 * =========================================================================================
 * Génère un middleware de validation MongoDB ObjectId.
 *
 * - Vérifie qu'un paramètre de route correspond à un ObjectId valide
 * - Rend une erreur 400 si invalide
 *
 * @function validateMongoIdParam
 *
 * @param {string} [paramName="id"] - Nom du paramètre de route
 *
 * @returns {Function} - Middleware Express
 */

export function validateMongoIdParam(paramName = "id") {
    return (req, res, next) => {
        const value = req.params[paramName];

        const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

        if (!mongoIdRegex.test(value)) {
            return res.status(400).render("errors/400", {
                message: "Identifiant invalide."
            });
        }

        next();
    };
}

/**
 * NUMERIC PARAM VALIDATION
 * =========================================================================================
 * Génère un middleware de validation numérique.
 *
 * - Vérifie qu'un paramètre de route est strictement numérique
 * - Rend une erreur 400 si invalide
 *
 * @function validateNumberParam
 *
 * @param {string} [paramName="catwayNumber"] - Nom du paramètre de route
 *
 * @returns {Function} - Middleware Express
 */

export function validateNumberParam(paramName = "catwayNumber") {
    return (req, res, next) => {
        const value = req.params[paramName];

        if (!/^\d+$/.test(value)) {
            return res.status(400).render("errors/400", {
                message: "Paramètre numérique invalide."
            });
        }

        next();
    };
}