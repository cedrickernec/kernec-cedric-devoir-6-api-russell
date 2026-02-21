/**
 * ===================================================================
 * RESERVATION STATISTICS
 * ===================================================================
 * - Calcul les statistiques d'état des réservations
 * ===================================================================
 */

import { getReservationStatus } from "./reservationStatus.js";

export function computeReservationStats(reservations) {

    const stats = {
        total: reservations.lenght,
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