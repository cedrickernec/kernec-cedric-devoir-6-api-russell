/**
 * RESERVATION STATISTICS
 * =========================================================================================
 * @module reservationStats
 *
 * Calcule des statistiques d’état sur une liste de réservations.
 *
 * Compteurs :
 * - total
 * - upComing
 * - inProgress
 * - finished
 *
 * Dépendances :
 * - getReservationStatus
 *
 * Effets de bord :
 * - Aucun (fonction pure)
 */

import { getReservationStatus } from "./reservationStatus.js";

/**
 * COMPUTE RESERVATION STATS
 * =========================================================================================
 * Calcule les statistiques d’état d’un ensemble de réservations.
 *
 * @function computeReservationStats
 *
 * @param {Array<Object>} reservations Liste de réservations
 *
 * @returns {{
 *   total: number,
 *   upComing: number,
 *   inProgress: number,
 *   finished: number
 * }}
 */

export function computeReservationStats(reservations) {

    const stats = {
        total: reservations.length,
        upComing: 0,
        inProgress: 0,
        finished: 0
    };

    reservations.forEach(reservation => {

        const status = getReservationStatus(reservation);

        if (status.key === "UPCOMING") stats.upComing++;
        if (status.key === "IN_PROGRESS") stats.inProgress++;
        if (status.key === "FINISHED") stats.finished++;
    });

    return stats;
}