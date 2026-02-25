/**
 * ===================================================================
 * SIDEBAR CLOCK MIDDLEWARE
 * ===================================================================
 * - Fournit la date et l'heure actuelles auw vues
 * - Utilisé principalement par le sidebar
 * ===================================================================
 */

import { formatDateFR, formatTimeFR } from "../../utils/formatters/dateFormatter.js";

/**
 * Middleware d'injection de la date et heure actuelles.
 *
 * - Fournit la date formatée aux vues
 * - Fournit l'heure formatée aux vues
 * - Principalement utilisé par le sidebar
 *
 * @function sidebarClock
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Object} res.locals
 *
 * @param {Function} next - Passe au middleware suivant
 *
 * @returns {void}
 */
export default function sidebarClock(req, res, next) {
    const now = new Date();

    res.locals.currentDate = formatDateFR(now);
    res.locals.currentTime = formatTimeFR(now);

    next();
}