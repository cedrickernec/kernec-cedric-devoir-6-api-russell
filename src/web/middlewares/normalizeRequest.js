/**
 * --------------------------------------------------------------------
 * Normalisation des requêtes
 * --------------------------------------------------------------------
 * - Normalise les données entrantes avant validation
 * - Centralise les règles de formatage
 * - Évite la duplication dans les contrôleurs
 */

export const normalizeRequest = (req, res, next) => {
    if (req.body?.email) {
        req.body.email = req.body.email.toLowerCase().trim();
    }
    next();
}