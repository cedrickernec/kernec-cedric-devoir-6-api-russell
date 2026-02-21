/**
 * ===================================================================
 * SIDEBAR CLOCK MIDDLEWARE
 * ===================================================================
 * - Fournit la date et l'heure actuelles auw vues
 * - Utilisé principalement par le sidebar
 * ===================================================================
 */

import { formatDateFR, formatTimeFR } from "../../utils/formatters/dateFormatter.js";

export default function sidebarClock(req, res, next) {
    const now = new Date();

    res.locals.currentDate = formatDateFR(now);
    res.locals.currentTime = formatTimeFR(now);

    next();
}