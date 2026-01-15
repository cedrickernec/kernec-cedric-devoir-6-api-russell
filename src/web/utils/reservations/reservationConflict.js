/**
 * ===================================================================
 * RESERVATION CONFLICT DATES
 * ===================================================================
 * - Détecte si le catway est déjà réservé sur les dates.
 * - Utilisé lors de la création/modification d'une nouvelle réservation
 * ===================================================================
 */

import Reservation from "../../../api/models/Reservation.js";

export async function getReservationConflicts ({
    catwayNumber,
    startDate,
    endDate,
    excludeId
}) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const query = {
        catwayNumber: Number(catwayNumber),
        startDate: { $lte: end },
        endDate: { $gte: start }
    };

    if (excludeId) {
        query._id = { $ne: excludeId };
    }

    return Reservation.find(query);
}