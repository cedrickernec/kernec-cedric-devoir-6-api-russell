/**
 * ===================================================================
 * REQUEST NORMALISER
 * ===================================================================
 * - Normalise les données entrantes avant validation
 * - Centralise les règles de formatage
 * - Évite la dulication dans les contrôleurs
 * ===================================================================
 */

/**
 * Middleware de normalisation des données entrantes.
 *
 * - Transforme l'email en minuscule
 * - Supprime les espaces inutiles
 * - Évite la duplication de logique dans les contrôleurs
 *
 * @function normalizeRequest
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.body
 * @param {string} [req.body.email]
 *
 * @param {Object} res - Réponse Express
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
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