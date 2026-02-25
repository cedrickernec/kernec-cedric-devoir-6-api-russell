/**
 * ===================================================================
 * AUTH GUARD MIDDLEWARE
 * ===================================================================
 * - Protège les routes nécessitant une authentification
 * - Vérifie la présence d'un utilisateur en session
 * - Expose l'utilisateur dans toutes les vues
 * ===================================================================
 */

/**
 * Middleware de protection des routes authentifiées.
 *
 * - Vérifie la présence d'un utilisateur en session
 * - Redirige vers la page de connexion si absent
 * - Expose l'utilisateur dans res.locals
 *
 * @function authGuard
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.session
 * @param {Object} [req.session.user]
 *
 * @param {Object} res - Réponse Express
 * @param {Object} res.locals
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
 */
export const authGuard = (req, res, next) => {

    const user = req.session?.user;

    if (!user) {
        return res.redirect("/");
    }

    res.locals.user = user;
    next();
};