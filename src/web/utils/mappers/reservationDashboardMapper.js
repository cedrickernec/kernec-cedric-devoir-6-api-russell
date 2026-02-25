/**
 * ===================================================================
 * VIEW MAPPER - RESERVATIONS DASHBOARD
 * ===================================================================
 * - Transforme une réservation API en modèle dashboard
 * - Formate les dates pour affichage rapide
 * - Calcule le statut visuel temps réel
 * ===================================================================
 */

import { formatDateFR } from "../formatters/dateFormatter.js";
import { computeReservationStatus } from "../business/reservations/reservationStatus.js";

/**
 * Transforme une réservation API en modèle Dashboard.
 *
 * - Formate les dates pour affichage rapide
 * - Calcule le statut visuel en temps réel
 * - Conserve les dates brutes pour logique interne
 *
 * @function mapReservationToDashboard
 *
 * @param {Object} reservation - Réservation issue de l'API
 * @param {string} reservation.id
 * @param {string} reservation.clientName
 * @param {string} reservation.boatName
 * @param {number|string} reservation.catwayNumber
 * @param {Date|string} reservation.startDate
 * @param {Date|string} reservation.endDate
 *
 * @returns {Object} - Modèle Dashboard
 */
export function mapReservationToDashboard(reservation) {
  return {
    id: reservation.id,

    clientName: reservation.clientName,
    boatName: reservation.boatName,
    catwayNumber: reservation.catwayNumber,

    startDateFormatted: formatDateFR(reservation.startDate),
    endDateFormatted: formatDateFR(reservation.endDate),

    status: computeReservationStatus(reservation),

    startDate: reservation.startDate,
    endDate: reservation.endDate
  };
}