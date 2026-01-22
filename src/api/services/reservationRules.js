/**
 * ============================================================
 * RESERVATION RULES
 * ============================================================
 * - Règles définies de ce qui est autorisé ou non
 * ============================================================
 */

// La réservation est-elle commencée ?
export function hasReservationStarted(reservation, now = new Date()) {
    return Boolean(
        reservation.startDate &&
        now >= reservation.startDate
    );
}

// La réservation est-elle terminée ?
export function isReservationFinished(reservation, now = new Date()) {
    return Boolean(
        reservation.endDate &&
        now > reservation.endDate
    );
}

// Peut-on modifier une réservation ?
export function canUpdateReservation(reservation, now = new Date()) {
    return !isReservationFinished(reservation, now);
}

// Peut-on supprimer une réservation ?
export function canDeleteReservation(reservation, now = new Date()) {
    return !hasReservationStarted(reservation, now);
}