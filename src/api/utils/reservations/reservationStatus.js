/**
 * ===================================================================
 * RESERVATION STATUS RESOLVER
 * ===================================================================
 * - Détermine le statut temporel d'une réservation
 * ===================================================================
 * États possibles :
 *      - UPCOMING      → À venir
 *      - IN_PROGRESS   → En cours
 *      - FINISHED      → Terminée
 * ===================================================================
 */

import {
    hasReservationStarted,
    isReservationFinished
} from "../../services/reservationRules.js";

/**
 * Détermine le statut temporel d'une réservation.
 *
 * États possibles :
 * - UPCOMING
 * - IN_PROGRESS
 * - FINISHED
 *
 * @function getReservationStatus
 *
 * @param {Object} reservation - Document réservation
 * @param {Date} [now=new Date()] - Date de référence
 *
 * @returns {{
 *   key: "UPCOMING"|"IN_PROGRESS"|"FINISHED",
 *   label: string
 * }}
 */
export function getReservationStatus(reservation, now = new Date()) {

    if (isReservationFinished(reservation, now)) {
        return {
            key: "FINISHED",
            label: "Terminée"
        };
    }

    if (hasReservationStarted(reservation, now)) {
        return {
            key: "IN_PROGRESS",
            label: "En cours"
        };
    }

    return {
        key: "UPCOMING",
        label: "À venir"
    };;
}