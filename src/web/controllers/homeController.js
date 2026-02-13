/**
 * --------------------------------------------------------------------
 * Page d'accueil / Connexion
 * --------------------------------------------------------------------
 * - Affiche la page de login
 * - Gère l'affichage des erreurs d'authentification
 * - Mode "sans animation" après erreur
 * - Utilise un layout dédié
 */

export const getHome = (req, res, next) => {
    try {
        if (req.session.user) {
            const redirectTo = req.query.redirect || "/dashboard";
            return res.redirect(redirectTo);
        }

        const redirect = req.query.redirect || "";
        
        const error = req.session.authError || null;
        const disableAnimations = req.session.disableAnimations || false;

        // Nettoyage des flags après lecture
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