/**
 * --------------------------------------------------------------------
 * Documentation API de l'application
 * --------------------------------------------------------------------
 * - Affiche la documentation technique de l'API
 * - Utilise un layout dédié
 */

export const getDocumentation = (req, res, next) => {
    try {
        res.render("documentation", {
            title: "Documentation de l'API Russell",
            layout: "layouts/docLayout"
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