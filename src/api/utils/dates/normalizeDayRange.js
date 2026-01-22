/**
 * ===================================================================
 * NORMALIZE DAY RANGE
 * ===================================================================
 * Fournir un intervalle de dates cohérent :
 *      - Normalise la date de début et de fin d'une réservation
 *      - Applique les règles horaires communes
 *      - Prépare les dates avant calcul de conflit
 *      - Garantit une comparaison fiable entre périodes
 * ===================================================================
 */
import { applyReservationTime } from "./applyReservationTime.js";

export const normalizeDayRange = (startDate, endDate) => {
    const start = applyReservationTime(startDate);
    const end = applyReservationTime(endDate);

    return { start, end };
};