/**
 * --------------------------------------------------------------------
 * Middleware d'exposition des données de session
 * --------------------------------------------------------------------
 * - Expose des informations de session aux vues
 * - Gère l'avertissement d'expiration de session
 * - Centralise les variables globales liées à la session
 */

import { sessionMaxAge } from "../configs/sessionConfig.js";

export const exposeSessionData = (req, res, next) => {
    res.locals.sessionMaxAge = sessionMaxAge;
    res.locals.forceSessionWarning = process.env.FORCE_SESSION_WARNING === "true";
    next();
};