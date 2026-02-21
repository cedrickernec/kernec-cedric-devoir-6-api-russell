/**
 * ===================================================================
 * VIEW MAPPER - RESERVATIONS
 * ===================================================================
 * - Transforme les données API en ViewModels utilisables par les vues
 * - Centralise le formatage des dates, status et durées
 * - Évite toute logique de présentation dans les contrôleurs
 * ===================================================================
*/

import { computeNightsBetweenDates } from "../formatters/computeReservationNights.js";
import { formatDateFR } from "../formatters/dateFormatter.js";
import { mapApiStatusToToViewStatus } from "./mapApiStatusToViewStatus.js";

// ==================================================
// MAPPER - RESERVATION LIST (TABLE)
// ==================================================

export function mapReservationToList(reservation) {
  
  const startDate =
  reservation.startDate
  ? new Date(reservation.startDate)
  : null;
  
  const endDate =
  reservation.endDate
  ? new Date(reservation.endDate)
  : null;

  const status = mapApiStatusToToViewStatus(
    reservation.status,
    startDate,
    endDate
  );

  return {
    id: reservation.id,
    catwayNumber: reservation.catwayNumber,

    clientName: reservation.clientName,
    boatName: reservation.boatName,

    // Date ISO
    startDateISO: startDate
    ? startDate.toISOString().slice(0,10)
    : "",

    endDateISO: endDate
    ? endDate.toISOString().slice(0,10)
    : "",

    // Date formatée pour l'affichage
    startDateFormatted: formatDateFR(startDate),
    endDateFormatted: formatDateFR(endDate),

    status
  };
}

// ==================================================
// MAPPER - RESERVATION DETAIL
// ==================================================

export function mapReservationToDetail(apiReservation) {

  const reservation = apiReservation.reservation;
  const client = apiReservation.client;
  const catway = apiReservation.catway;
  
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

  const updatedAt =
  reservation.updatedAt
  ? new Date(reservation.updatedAt)
  : null;
  
  const nights = computeNightsBetweenDates(startDate, endDate);

  const status = mapApiStatusToToViewStatus(
    reservation.status,
    startDate,
    endDate
  );

  return {
    id: reservation.id,

    status,

    clientName: client.clientName,
    boatName: client.boatName,

    catway: {
      number: catway.catwayNumber,
      type: catway.catwayType
    },
    
    startDateFormatted: formatDateFR(startDate),
    endDateFormatted: formatDateFR(endDate),
    
    duration: nights
    ? `${nights} nuit${nights > 1 ? "s" : ""}`
    : "-",
    
    createdAtFormatted: createdAt
    ? formatDateFR(createdAt)
    : "-",

    updatedAtFormatted: updatedAt
    ? formatDateFR(updatedAt)
    : "-"
  };
}

// ==================================================
// MAPPER - RESERVATION EDIT
// ==================================================

export function mapReservationEdit(apiReservation) {

  const reservation = apiReservation.reservation;
  const client = apiReservation.client;
  const catway = apiReservation.catway;

  const now = new Date();
  
  const startDate =
  reservation.startDate
  ? new Date(reservation.startDate)
  : null;

  const isStartDateLocked =
  startDate
  ? startDate <= now
  : false;

  return {
    id: reservation.id,

    clientName: client.clientName,
    boatName: client.boatName,

    catway: {
      number: catway.catwayNumber,
      type: catway.catwayType
    },

    startDateISO: reservation.startDate
      ? reservation.startDate.split("T")[0]
      : "",

    endDateISO: reservation.endDate
      ? reservation.endDate.split("T")[0]
      : "",

    createdAtFormatted: formatDateFR(reservation.createdAt)
      ? formatDateFR(new Date(reservation.createdAt))
      : "-",

    updatedAtFormatted: formatDateFR(reservation.updatedAt)
      ? formatDateFR(new Date(reservation.updatedAt))
      : "-",

    isStartDateLocked
  };
}

// ==================================================
// MAPPER - AVAILABILITY (TABLE)
// ==================================================

export function mapAvailabilityToTable({ catway, availability, flattenPartials = false }) {

  const from = availability.from || null;
  const to = availability.to ||  null;

  const isFull = availability.status === "full";
  const isPartial = availability.status === "partial";

  const formatISODate = (iso) => iso
  ? iso.split("-").reverse().join("/")
  : null;

  const slots = isPartial
  ? (availability.slots || []).map(slot => ({
    from: slot.from,
    to: slot.to,
    fromFormatted: formatISODate(slot.from),
    toFormatted: formatISODate(slot.to),
  }))
  : [];

  // Mode éclatement des partiels
  if (flattenPartials && isPartial && slots.length > 0) {
    return slots.map(slot => ({
      catway: {
        number: catway.catwayNumber,
        type: catway.catwayType
      },

      fromISO: slot.from,
      toISO: slot.to,

      fromFormatted: slot.fromFormatted,
      toFormatted: slot.toFormatted,

      status: "partial",

      isFull: false,
      isPartial: true,

      slotsCount: 1,
      slots: []
    }));
  }

  return {
    catway: {
      number: catway.catwayNumber,
      type: catway.catwayType
    },

    fromISO: isFull ? from : null,
    toISO: isFull ? to : null,

    fromFormatted: isFull && from ? formatISODate(from) : null,
    toFormatted: isFull && to ? formatISODate(to) : null,

    status: availability.status,

    isFull,
    isPartial,

    slotsCount : slots.length,
    slots
  };
}

// ==================================================
// MAPPER - ERRORS (EDIT RESERVATION)
// ==================================================

export function mapReservationErrors(apiData, reservation, rawErrors = {}) {

  const errors = rawErrors || {};

  const dateError = errors.Dates || errors.startDate || errors.endDate;

  const viewErrors = {
    ...errors,
    dateError
  };

  if (reservation?.isStartDateLocked) {
    viewErrors.endDate = dateError;
    delete viewErrors.startDate;
  }

  return { viewErrors };
}