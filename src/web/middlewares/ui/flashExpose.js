/**
 * ===================================================================
 * FLASH MESSAGE EXPOSER
 * ===================================================================
 * - Rend les messages flash accessibles aux vues
 * - Supprime automatiquement le message après lecture
 * - Utilisé après redirection
 * ===================================================================
 */

export const exposeFlash = (req, res, next) => {
    res.locals.flash = req.session.flash || null;
    delete req.session.flash;
    next();
};