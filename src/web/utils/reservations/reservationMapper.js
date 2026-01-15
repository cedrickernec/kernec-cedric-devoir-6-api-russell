/**
 * ===================================================================
 * VIEW MAPPER - RESERVATIONS
 * ===================================================================
 */

import { computeDurationDays } from "../computeDurationDays.js";
import { computeReservationStatus } from "./reservationStatus.js";
import { formatDateFR } from "../dateFormatter.js";

// ==================================================
// MAPPER RESERVATION DETAIL
// ==================================================

export function mapReservationToDetail(reservation) {
  const status = computeReservationStatus(reservation);
  
  const startDate =
  reservation.startDate
  ? new Date(reservation.startDate)
  : null;
  
  const endDate =
  reservation.endDate
  ? new Date(reservation.endDate)
  : null;
  
  const createdAt =
  reservation.createdAt
  ? new Date(reservation.createdAt)
  : null;
  
  const days = computeDurationDays(startDate, endDate);

  return {
    id: reservation._id.toString(),

    status,

    clientName: reservation.clientName,
    boatName: reservation.boatName,

    catway: {
      number: reservation.catwayNumber,
      type: reservation.catwayType
    },

    startDateFormatted: formatDateFR(startDate),
    endDateFormatted: formatDateFR(endDate),

    duration: days
      ? `${days} jour${days > 1 ? "s" : ""}`
      : "-",

    createdAtFormatted: formatDateFR(createdAt)
  };
}

// ==================================================
// MAPPER RESERVATION EDIT
// ==================================================

export function mapReservationEdit(reservation) {
  const now = new Date();
  const startDate = reservation.startDate
    ? new Date(reservation.startDate)
    : null;

  const isStartDateLocked = startDate ? startDate <= now : false;

  return {
    id: reservation._id.toString(),

    clientName: reservation.clientName,
    boatName: reservation.boatName,

    catway: {
      number: reservation.catwayNumber,
      type: reservation.catwayType
    },

    startDateISO: reservation.startDate
      ? reservation.startDate.toISOString().split("T")[0]
      : "",

    endDateISO: reservation.endDate
      ? reservation.endDate.toISOString().split("T")[0]
      : "",

    createdAtFormatted: reservation.createdAt
      ? reservation.createdAt.toLocaleDateString("fr-FR")
      : "-",

    isStartDateLocked
  };
}

// ==================================================
// MAPPER RESERVATION LIST (TABLE)
// ==================================================

export function mapReservationToList(reservation) {
  const status = computeReservationStatus(reservation);

  const startDate =
  reservation.startDate
  ? new Date(reservation.startDate)
  : null;
  
  const endDate =
  reservation.endDate
  ? new Date(reservation.endDate)
  : null;

  return {
    id: reservation._id.toString(),

    status,

    clientName: reservation.clientName,
    boatName: reservation.boatName,
    catway: {
      number: reservation.catwayNumber,
      type: reservation.catwayType
    },

    // Date brute
    startDate,
    endDate,

    // Date formatée pour l'affichage
    startDateFormatted: formatDateFR(startDate),
    endDateFormatted: formatDateFR(endDate)
  };
}

// ==================================================
// MAPPER AVAILABILITY (TABLE)
// ==================================================

export function mapAvailabilityToTable({ catway, compatibility }) {
  const from =
  compatibility.from
  ? new Date(compatibility.from)
  : null;
  
  const to =
  compatibility.to
  ? new Date(compatibility.to)
  : null;

  const slots = (compatibility.slots || []).map(slot => ({
    from: slot.from,
    to: slot.to,
    fromFormatted: formatDateFR(new Date(slot.from)),
    toFormatted: formatDateFR(new Date(slot.to)),
  }));
  const slotsCount = slots.length;

  return {
    catway: {
      number: catway.catwayNumber,
      type: catway.catwayType
    },

    fromFormatted: formatDateFR(from),
    toFormatted: formatDateFR(to),

    status: compatibility.status,
    isPartial: compatibility.status === "partial",
    isFull: compatibility.status === "full",

    slotsCount,
    slots
  };
}