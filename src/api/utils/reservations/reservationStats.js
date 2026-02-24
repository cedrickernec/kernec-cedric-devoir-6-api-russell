/**
 * ===================================================================
 * RESERVATION STATISTICS
 * ===================================================================
 * - Calcul les statistiques d'état des réservations
 * ===================================================================
 */

import { getReservationStatus } from "./reservationStatus.js";

/**
 * Calcule les statistiques d'état d'un ensemble de réservations.
 *
 * Compte :
 * - total
 * - upComing
 * - inProgress
 * - finished
 *
 * @function computeReservationStats
 *
 * @param {Array<Object>} reservations - Liste des réservations
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