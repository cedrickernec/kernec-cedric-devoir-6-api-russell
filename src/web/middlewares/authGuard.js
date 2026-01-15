/**
 * --------------------------------------------------------------------
 * Middleware de protection d'authentification
 * --------------------------------------------------------------------
 * - Protège les routes privées
 * - Redirige vers "/" si non authentifié
 * - Rend l'utilisateur disponible dans toutes les vues
 */

export const authGuard = (req, res, next) => {
    if (!req.session?.user) {
        return res.redirect("/");
    }

    res.locals.user = req.session.user;
    next();
};