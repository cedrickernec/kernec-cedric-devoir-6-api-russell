/**
 * --------------------------------------------------------------------
 * Middleware : horloge et date de la barre latérale
 * --------------------------------------------------------------------
 * - Fournit l'heure et la date courantes aux vues
 * - Principalement utilisé dans la sidebar
 */

import { formatDateFR, formatTimeFR } from "../utils/dateFormatter.js";

export default function sidebarClock(req, res, next) {
    const now = new Date();

    res.locals.currentDate = formatDateFR(now);
    res.locals.currentTime = formatTimeFR(now);

    next();
}