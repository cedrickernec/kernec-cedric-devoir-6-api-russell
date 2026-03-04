/**
 * PUBLIC ERROR PAGE CONFIG
 * =========================================================================================
 * Middleware de configuration des pages publiques.
 *
 * - Configure l'UI des pages d'erreur publiques
 * - Désactive navigation retour et logout
 *
 * @function publicPage
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Object} res.locals
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
 */

export const publicPage = (req, res, next) => {
    
    res.locals.errorUI = {
        showBack: false,
        showLogout: false
    };

    next();
};