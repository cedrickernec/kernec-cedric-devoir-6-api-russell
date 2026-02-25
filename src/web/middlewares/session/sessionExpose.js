/**
 * ===================================================================
 * SESSION DATA EXPOSER
 * ===================================================================
 * - Expose les données de session aux vues
 * - Gère l'avertissement d'expiration
 * - Centralise les flags liés à la session
 * ===================================================================
 */

import { sessionMaxAge } from "../../configs/sessionConfig.js";

/**
 * Middleware d'exposition des données de session aux vues.
 *
 * - Injecte sessionMaxAge dans res.locals
 * - Gère le flag d'avertissement d'expiration
 * - Réinitialise le flag justLoggedIn
 *
 * @function exposeSessionData
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.session
 * @param {boolean} [req.session.justLoggedIn]
 *
 * @param {Object} res - Réponse Express
 * @param {Object} res.locals
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
 */
export const exposeSessionData = (req, res, next) => {
    res.locals.sessionMaxAge = sessionMaxAge;
    res.locals.forceSessionWarning = process.env.FORCE_SESSION_WARNING === "true";
    res.locals.justLoggedIn = req.session.justLoggedIn || false;
    req.session.justLoggedIn = false;
    next();
};