/**
 * RESERVATION FORMATTER
 * =========================================================================================
 * @module reservationFormatter
 *
 * Formate les réservations pour les réponses API.
 *
 * Objectifs :
 * - Contrôler les champs exposés
 * - Normaliser les structures de sortie (détaillé vs liste)
 * - Ajouter le statut temporel (UPCOMING / IN_PROGRESS / FINISHED)
 * - Formater la disponibilité (full/partial/none) avec dates ISO
 *
 * Dépendances :
 * - formatDateISO
 * - getReservationStatus
 */

import { formatDateISO } from "../dates/formatDateISO.js";
import { getReservationStatus } from "../reservations/reservationStatus.js";

/**
 * FORMAT RESERVATION (DETAIL)
 * =========================================================================================
 * Formate une réservation détaillée (réservation + catway).
 *
 * @function formatReservation
 *
 * @param {Object} options
 * @param {Object} options.reservation Document Mongo Reservation
 * @param {Object} options.catway Document Mongo Catway
 *
 * @returns {Object|null}
 */

export function formatReservation({ reservation, catway }) {
  if (!reservation || !catway) return null;

  const rObject = reservation.toObject();
  const cObject = catway.toObject();
  const status = getReservationStatus(reservation);

  return {
    catway: {
      catwayNumber: cObject.catwayNumber,
      catwayType: cObject.catwayType
    },
    client: {
      clientName: rObject.clientName,
      boatName: rObject.boatName
    },
    reservation: {
      id: rObject._id,
      status,
      startDate: rObject.startDate,
      endDate: rObject.endDate,
      createdAt : rObject.createdAt,
      updatedAt : rObject.updatedAt
    },
  };
}

/**
 * FORMAT RESERVATIONS LIST
 * =========================================================================================
 * Formate une liste simplifiée de réservations.
 *
 * @function formatReservationsList
 *
 * @param {Array<Object>} reservations
 *
 * @returns {Array<Object>}
 */

export function formatReservationsList(reservations) {

  return reservations.map((reservation) => {
      
    const object = reservation.toObject();
    const status = getReservationStatus(reservation);

    return {
      id: object._id,
      catwayNumber: object.catwayNumber,
      clientName: object.clientName,
      boatName: object.boatName,
      status,
      startDate: object.startDate,
      endDate: object.endDate,
      createdAt : object.createdAt,
      updatedAt : object.updatedAt
    };
  });
}

/**
 * FORMAT AVAILABILITY
 * =========================================================================================
 * Formate le résultat de disponibilité pour l’API.
 *
 * Statuts :
 * - full    : { from, to }
 * - partial : { slots: [{from,to}, ...] }
 * - none    : { status: "none" }
 *
 * @function formatAvailability
 *
 * @param {Array<{catway: Object, compatibility: Object}>} apiAvailability
 *
 * @returns {Array<Object>}
 */

export function formatAvailability(apiAvailability) {

  return apiAvailability.map(({ catway, compatibility }) => {

    const catwayKeys = {
      catwayNumber: catway.catwayNumber,
      catwayType: catway.catwayType,
      catwayState: catway.catwayState
    }

    // FULL
    if (compatibility.status === "full") {
      return {
        catway: catwayKeys,
        availability: {
          status: "full",
          from: formatDateISO(compatibility.from),
          to: formatDateISO(compatibility.to)
        }
      };
    }

    // PARTIAL
    if (compatibility.status === "partial") {
      return {
        catway: catwayKeys,
        availability: {
          status: "partial",
          slots: compatibility.slots.map(slot => ({
            from: formatDateISO(slot.from),
            to: formatDateISO(slot.to)
          }))
        }
      };
    }

    // NONE
    return {
      catway: catwayKeys,
      availability: {
        status: "none"
      }
    };
  });
}