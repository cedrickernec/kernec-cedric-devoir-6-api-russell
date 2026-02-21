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