/**
 * RESERVATION STATUS RESOLVER
 * =========================================================================================
 * @module reservationStatus
 *
 * Détermine le statut temporel d’une réservation en fonction des dates.
 *
 * Statuts :
 * - UPCOMING    : à venir
 * - IN_PROGRESS : en cours
 * - FINISHED    : terminée
 *
 * Dépendances :
 * - reservationRules.hasReservationStarted
 * - reservationRules.isReservationFinished
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */

import {
    hasReservationStarted,
    isReservationFinished
} from "../../services/reservationRules.js";

/**
 * GET RESERVATION STATUS
 * =========================================================================================
 * Détermine le statut temporel d’une réservation.
 *
 * @function getReservationStatus
 *
 * @param {Object} reservation Document réservation (au minimum startDate/endDate)
 * @param {Date} [now=new Date()] Date de référence (tests / time-travel)
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