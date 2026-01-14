/**
 * --------------------------------------------------------------------
 * Gestion de l'UI des pages d'erreur
 * --------------------------------------------------------------------
 * - Définition des pages publiques/privées
 * - Adapte l'UI sans toucher aux vues d'erreur
 */

export const publicPage = (req, res, next) => {
    res.locals.errorUI = {
        showBack: false,
        showLogout: false
    };

    next();
};