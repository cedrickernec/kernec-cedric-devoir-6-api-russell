/**
 * --------------------------------------------------------------------
 * Middleware de protection d'authentification
 * --------------------------------------------------------------------
 * - Protège les routes privées
 * - Redirige vers "/" si non authentifié
 * - Rend l'utilisateur disponible dans toutes les vues
 */

export const authGuard = (req, res, next) => {

    const user = req.session?.user;

    if (!user) {
        return res.redirect("/");
    }

    res.locals.user = user;
    next();
};