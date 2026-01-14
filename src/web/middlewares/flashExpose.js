/**
 * --------------------------------------------------------------------
 * Middleware d'exposition de massage flash
 * --------------------------------------------------------------------
 * - Expose les messages flash à toutes les vues
 * - Supprime le flash après affichage
 * - Utilisé pour les succès/erreurs post-redirection
 */

export const exposeFlash = (req, res, next) => {
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
};