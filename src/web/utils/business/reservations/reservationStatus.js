/**
 * RESERVATION STATUS COMPUTATION (WEB)
 * =========================================================================================
 * @module reservationStatus
 *
 * Détermine le statut temporel d’une réservation pour l’UI.
 *
 * Responsabilités :
 * - Comparer la date actuelle avec startDate et endDate
 * - Retourner les métadonnées visuelles associées
 */

import { normalizeDateRange } from "../../normalizeDateRange.js";

/**
 * COMPUTE RESERVATION STATUS
 * =========================================================================================
 * Calcule le statut temporel d’une réservation.
 *
 * @function computeReservationStatus
 *
 * @param {Object} params
 * @param {Date|string} params.startDate
 * @param {Date|string} params.endDate
 *
 * @returns {Object}
 * @returns {string} returns.label
 * @returns {string} returns.className
 * @returns {string} returns.aria
 * @returns {string} returns.semantic
 */

export function computeReservationStatus({startDate, endDate}) {
    const now = new Date();
    const start = normalizeDateRange(startDate, "start");
    const end = normalizeDateRange(endDate, "end")

    // UPCOMING / À VENIR
    if (now < start) {
        return {
            label: "À venir",
            className: "status--upcoming",
            aria: "Réservation à venir",
            semantic: "upcoming"
        };
    }

    // IN PROGRESS / EN COURS
    if (now >= start && now <= end) {
        return {
            label: "En cours",
            className: "status--in-progress",
            aria: "Réservation en cours",
            semantic: "in-progress"
        };
    }

    // FINISHED / TERMINÉE
    return {
        label: "Terminée",
        className: "status--finished",
        aria: "Réservation terminée",
        semantic: "finished"
    };
}