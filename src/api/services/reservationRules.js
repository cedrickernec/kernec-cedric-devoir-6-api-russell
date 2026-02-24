/**
 * ============================================================
 * RESERVATION RULES
 * ============================================================
 * - Règles définies de ce qui est autorisé ou non
 * ============================================================
 */

/**
 * Indique si une réservation a déjà commencé.
 *
 * @function hasReservationStarted
 *
 * @param {Object} reservation
 * @param {Date} reservation.startDate
 * @param {Date} [now=new Date()] - Date de référence (utile pour tests)
 *
 * @returns {boolean} - true si la réservation est commencée
 */
export function hasReservationStarted(reservation, now = new Date()) {
    return Boolean(
        reservation.startDate &&
        now >= reservation.startDate
    );
}

/**
 * Indique si une réservation est terminée.
 *
 * @function isReservationFinished
 *
 * @param {Object} reservation
 * @param {Date} reservation.endDate
 * @param {Date} [now=new Date()] - Date de référence (utile pour tests)
 *
 * @returns {boolean} - true si la réservation est terminée
 */
export function isReservationFinished(reservation, now = new Date()) {
    return Boolean(
        reservation.endDate &&
        now > reservation.endDate
    );
}

/**
 * Détermine si une réservation peut être modifiée.
 *
 * Une réservation terminée ne peut plus être modifiée.
 *
 * @function canUpdateReservation
 *
 * @param {Object} reservation
 * @param {Date} [now=new Date()]
 *
 * @returns {boolean} - true si la modification est autorisée
 */
export function canUpdateReservation(reservation, now = new Date()) {
    return !isReservationFinished(reservation, now);
}

/**
 * Détermine si une réservation peut être supprimée sans confirmation.
 *
 * Une réservation déjà commencée nécessite une confirmation par mot de passe.
 *
 * @function canDeleteReservation
 *
 * @param {Object} reservation
 * @param {Date} [now=new Date()]
 *
 * @returns {boolean} - true si la suppression est autorisée sans confirmation
 */
export function canDeleteReservation(reservation, now = new Date()) {
    return !hasReservationStarted(reservation, now);
}