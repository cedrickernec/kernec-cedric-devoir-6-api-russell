/**
 * HOME PAGE
 * =========================================================================================
 * Affiche la page de connexion.
 *
 * - Redirige vers le dashboard si déjà connecté
 * - Gère les erreurs d'authentification stockées en session
 * - Nettoie les flags temporaires de session
 *
 * @function getHomeView
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {void}
 */

export const getHomeView = (req, res, next) => {
    try {

        // Déja connecté → Dashboard
        if (req.session.user) {
            const redirectTo = req.query.redirect || "/dashboard";
            return res.redirect(redirectTo);
        }

        const redirect = req.query.redirect || "";
        
        const error = req.session.authError || null;
        const disableAnimations = req.session.disableAnimations || false;

        // Nettoyage des flags session après lecture
        delete req.session.authError;
        delete req.session.disableAnimations;

        res.render("login", {
            title: "Connexion - API Russell",
            layout: "layouts/authLayout",
            bodyClass: "scroll-main auth-page",
            error,
            disableAnimations,
            redirect
        });
        
    } catch (error) {
        error.status = 500;
        error.ui = {
            showBack: false,
            showLogout: false
        };
        next(error);
    }
};