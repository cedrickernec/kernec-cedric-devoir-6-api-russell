/**
 * ===================================================================
 * AUTH GUARD MIDDLEWARE
 * ===================================================================
 * - Protège les routes nécessitant une authentification
 * - Vérifie la présence d'un utilisateur en session
 * - Expose l'utilisateur dans toutes les vues
 * ===================================================================
 */

export const authGuard = (req, res, next) => {

    const user = req.session?.user;

    if (!user) {
        return res.redirect("/");
    }

    res.locals.user = user;
    next();
};