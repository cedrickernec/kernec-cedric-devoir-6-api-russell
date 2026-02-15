/**
 * ===================================================================
 * PUBLIC ERROR PAGE CONFIG
 * ===================================================================
 * - Configure l'UI des pages d'erreur publiques
 * - Désactive navigation retour et logout
 * ===================================================================
 */

export const publicPage = (req, res, next) => {
    
    res.locals.errorUI = {
        showBack: false,
        showLogout: false
    };

    next();
};