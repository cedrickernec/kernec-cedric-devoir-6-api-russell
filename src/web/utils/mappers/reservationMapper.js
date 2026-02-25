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
import { mapApiStatusToViewStatus } from "./mapApiStatusToViewStatus.js";

// ==================================================
// MAPPER - RESERVATION LIST (TABLE)
// ==================================================
/**
 * Transforme une réservation API en modèle liste (table).
 *
 * - Convertit les dates ISO
 * - Formate les dates pour affichage
 * - Enrichit le statut via mapApiStatusToViewStatus
 *
 * @function mapReservationToList
 *
 * @param {Object} reservation
 *
 * @returns {Object} - Modèle liste
 */
export function mapReservationToList(reservation) {
  
  const startDate =
  reservation.startDate
  ? new Date(reservation.startDate)
  : null;
  
  const endDate =
  reservation.endDate
  ? new Date(reservation.endDate)
  : null;

  const status = mapApiStatusToViewStatus(
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
/**
 * Transforme une réservation API enrichie en modèle détail.
 *
 * - Calcule la durée en nuits
 * - Formate les dates
 * - Enrichit le statut
 *
 * @function mapReservationToDetail
 *
 * @param {Object} apiReservation
 * @param {Object} apiReservation.reservation
 * @param {Object} apiReservation.client
 * @param {Object} apiReservation.catway
 *
 * @returns {Object} - Modèle détail
 */
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

  const status = mapApiStatusToViewStatus(
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
/**
 * Transforme une réservation API en modèle édition.
 *
 * - Détermine si la date de début est verrouillée
 * - Prépare les dates ISO pour les inputs HTML
 *
 * @function mapReservationEdit
 *
 * @param {Object} apiReservation
 *
 * @returns {Object} - Modèle édition
 */
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
/**
 * Transforme les données de disponibilité API
 * en modèle table.
 *
 * - Gère les disponibilités complètes et partielles
 * - Peut éclater les partiels en plusieurs lignes
 *
 * @function mapAvailabilityToTable
 *
 * @param {Object} params
 * @param {Object} params.catway
 * @param {Object} params.availability
 * @param {boolean} [params.flattenPartials=false]
 *
 * @returns {Object|Object[]} - Modèle table ou liste éclatée
 */
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
// MAPPER - ERRORS
// ==================================================
/**
 * Transforme les erreurs API en modèle d'erreurs vue.
 *
 * - Regroupe les erreurs de date
 * - Adapte les erreurs si la date de début est verrouillée
 *
 * @function mapReservationErrors
 *
 * @param {Object} apiData
 * @param {Object} reservation
 * @param {Object} [rawErrors]
 *
 * @returns {Object} - Objet contenant viewErrors
 */
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