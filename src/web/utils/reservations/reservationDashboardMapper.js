/**
 * ===================================================================
 * VIEW MAPPER - RESERVATIONS DASHBOARD
 * ===================================================================
 */

import { formatDateFR } from "../dateFormatter.js";
import { computeReservationStatus } from "./reservationStatus.js";

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