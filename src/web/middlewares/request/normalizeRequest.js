/**
 * ===================================================================
 * REQUEST NORMALISER
 * ===================================================================
 * - Normalise les données entrantes avant validation
 * - Centralise les règles de formatage
 * - Évite la dulication dans les contrôleurs
 * ===================================================================
 */

export const normalizeRequest = (req, res, next) => {

    // ==================================================
    // EMAIL NORMALISATION
    // ==================================================

    if (req.body?.email) {
        req.body.email =
            req.body.email
            .toLowerCase()
            .trim();
    }

    next();
}