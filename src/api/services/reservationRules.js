/**
 * RESERVATION RULES
 * =========================================================================================
 * @module reservationRules
 *
 * Centralise les règles métier “pures” liées aux réservations.
 *
 * Fonctionnalités :
 * - Déterminer si une réservation a commencé / est terminée
 * - Déterminer si une réservation peut être modifiée
 * - Déterminer si une réservation peut être supprimée sans confirmation
 *
 * Format attendu :
 * - Les fonctions prennent une réservation (objet) + une date de référence optionnelle (tests)
 */

/**
 * HAS RESERVATION STARTED
 * =========================================================================================
 * Indique si une réservation a commencé.
 *
 * @function hasReservationStarted
 *
 * @param {Object} reservation
 * @param {Date} reservation.startDate
 * @param {Date} [now=new Date()]
 *
 * @returns {boolean}
 */

export function hasReservationStarted(reservation, now = new Date()) {
    return Boolean(
        reservation.startDate &&
        now >= reservation.startDate
    );
}

/**
 * IS RESERVATION FINISHED
 * =========================================================================================
 * Indique si une réservation est terminée.
 *
 * @function isReservationFinished
 *
 * @param {Object} reservation
 * @param {Date} reservation.endDate
 * @param {Date} [now=new Date()]
 *
 * @returns {boolean}
 */

export function isReservationFinished(reservation, now = new Date()) {
    return Boolean(
        reservation.endDate &&
        now > reservation.endDate
    );
}

/**
 * CAN UPDATE RESERVATION
 * =========================================================================================
 * Détermine si une réservation peut être modifiée.
 *
 * @function canUpdateReservation
 *
 * @param {Object} reservation
 * @param {Date} [now=new Date()]
 *
 * @returns {boolean}
 */

export function canUpdateReservation(reservation, now = new Date()) {
    return !isReservationFinished(reservation, now);
}

/**
 * CAN DELETE RESERVATION
 * =========================================================================================
 * Détermine si une réservation peut être supprimée sans confirmation.
 *
 * @function canDeleteReservation
 *
 * @param {Object} reservation
 * @param {Date} [now=new Date()]
 *
 * @returns {boolean}
 */

export function canDeleteReservation(reservation, now = new Date()) {
    return !hasReservationStarted(reservation, now);
}