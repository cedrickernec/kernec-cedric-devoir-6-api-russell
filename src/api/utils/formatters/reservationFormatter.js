/**
 * ============================================================
 * RESERVATION FORMATTER
 * ============================================================
 * - Formate les réponses retournées :
 *      - Nettoie les documents Mongo
 *      - Contrôle les champs exposés
 *      - Définit l'ordre des clés
 * ============================================================
 */

import { formatDateISO } from "../dates/formatDateISO.js";
import { getReservationStatus } from "../reservations/reservationStatus.js";

/**
 * Formate une réservation détaillée pour la réponse API.
 *
 * Structure :
 * - catway
 * - client
 * - reservation
 *
 * @function formatReservation
 *
 * @param {Object} options
 * @param {Object} options.reservation - Document Mongo Reservation
 * @param {Object} options.catway - Document Mongo Catway
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
 * Formate le résultat de disponibilité pour l'API.
 *
 * Gère les trois statuts :
 * - full
 * - partial
 * - none
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