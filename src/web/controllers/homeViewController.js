/**
 * ===================================================================
 * HOME / LOGIN VIEW CONTROLLER
 * ===================================================================
 * - Affiche la page de connexion
 * - Gère les erreurs d'authentification
 * - Désactive animations après échec login
 * ===================================================================
 */

// ==================================================
// HOME PAGE
// ==================================================

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