/**
 * STATUS MAPPER - API TO VIEW
 * =========================================================================================
 * @module mapApiStatusToViewStatus
 *
 * Combine le statut métier API avec le statut visuel UI.
 *
 * Responsabilités :
 * - Conserver key/label API
 * - Injecter className / aria / semantic
 *
 * Dépendances :
 * - computeReservationStatus
 */

import { computeReservationStatus } from "../business/reservations/reservationStatus.js";

/**
 * MAP API STATUS TO VIEW STATUS
 * =========================================================================================
 * Enrichit le statut API avec des métadonnées UI.
 *
 * @function mapApiStatusToViewStatus
 *
 * @param {Object} apiStatus
 * @param {string} apiStatus.key
 * @param {string} apiStatus.label
 *
 * @param {Date|string} startDate
 * @param {Date|string} endDate
 *
 * @returns {Object} - Statut enrichi pour la vue
 * @returns {string} - returns.key
 * @returns {string} - returns.label
 * @returns {string} - returns.className
 * @returns {string} - returns.aria
 * @returns {string} - returns.semantic
 */

export function mapApiStatusToViewStatus(apiStatus, startDate, endDate) {

    // Calcul du statut UI basé sur les dates
    const computed = computeReservationStatus({
        startDate,
        endDate
    });

    const status = {
        key: apiStatus.key,
        label: apiStatus.label,
        className: computed.className,
        aria: computed.aria,
        semantic: computed.semantic
    }

    return status;
}