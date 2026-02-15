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

export const exposeSessionData = (req, res, next) => {
    res.locals.sessionMaxAge = sessionMaxAge;
    res.locals.forceSessionWarning = process.env.FORCE_SESSION_WARNING === "true";
    res.locals.justLoggedIn = req.session.justLoggedIn || false;
    req.session.justLoggedIn = false;
    next();
};