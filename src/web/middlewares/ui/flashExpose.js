/**
 * FLASH MESSAGE EXPOSER
 * =========================================================================================
 * Middleware d'exposition des messages flash.
 *
 * - Rend le message flash accessible aux vues
 * - Supprime automatiquement le message après lecture
 * - Utilisé après redirection
 *
 * @function exposeFlash
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.session
 * @param {Object} [req.session.flash]
 *
 * @param {Object} res - Réponse Express
 * @param {Object} res.locals
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
 */

export const exposeFlash = (req, res, next) => {
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
};