/**
 * ===================================================================
 * RESERVATION REPOSITORY
 * ===================================================================
 * - Lit et écrit les données uniquement :
 *      - Centralise tous les accès à la base de données
 * ===================================================================
 */

import Reservation from "../models/Reservation.js";

// ===============================================
// GET ALL RESERVATION
// ===============================================
/**
 * Récupère toutes les réservations.
 *
 * - Triées par date de début décroissante
 *
 * @async
 * @function getAllReservations
 *
 * @returns {Promise<Object[]>}
 */
export async function getAllReservations() {

    return Reservation.find().sort({ startDate: -1 });
}

// ===============================================
// GET RESERVATIONS BY CATWAY
// ===============================================
/**
 * Recherche une réservation par identifiant
 * et numéro de catway.
 *
 * @async
 * @function findReservationById
 *
 * @param {number|string} catwayNumber
 * @param {string} idReservation
 *
 * @returns {Promise<Object|null>}
 */
export async function getReservationsByCatway(catwayNumber) {

    return Reservation.find({ catwayNumber }).sort({ startDate: -1 });
}

// ===============================================
// FIND RESERVATION BY ID
// ===============================================
/**
 * Recherche une réservation par identifiant
 * et numéro de catway.
 *
 * @async
 * @function findReservationById
 *
 * @param {number|string} catwayNumber
 * @param {string} idReservation
 *
 * @returns {Promise<Object|null>}
 */
export async function findReservationById(catwayNumber, idReservation) {

    return Reservation.findOne({ _id: idReservation, catwayNumber });
}

// ===============================================
// GET RESERVATION OVERLAPPING PERIOD
// ===============================================
/**
 * Récupère les réservations chevauchant une période.
 *
 * @async
 * @function getReservationsOverlappingPeriod
 *
 * @param {Object} params
 * @param {Date} params.start
 * @param {Date} params.end
 *
 * @returns {Promise<Object[]>}
 */
export async function getReservationsOverlappingPeriod({ start, end }) {
    return Reservation.find({
        startDate: { $lte: end },
        endDate: { $gte: start }
    });
}

// ===============================================
// CREATE RESERVATION
// ===============================================
/**
 * Crée une nouvelle réservation.
 *
 * @async
 * @function createReservation
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>}
 */
export async function createReservation(data) {

    return Reservation.create(data);
}

// ===============================================
// DELETE RESERVATION
// ===============================================
/**
 * Supprime une réservation.
 *
 * @async
 * @function deleteReservation
 *
 * @param {number|string} catwayNumber
 * @param {string} idReservation
 *
 * @returns {Promise<Object|null>}
 */
export async function deleteReservation(catwayNumber, idReservation) {

    return Reservation.findOneAndDelete({ catwayNumber, _id: idReservation });
}

// ===============================================
// FIND RESERVATION CONFLICT
// ===============================================
/**
 * Recherche un conflit de réservation.
 *
 * - Vérifie chevauchement de dates
 * - Peut exclure un identifiant
 *
 * @async
 * @function findReservationConflict
 *
 * @param {Object} params
 * @param {number|string} params.catwayNumber
 * @param {Date} params.start
 * @param {Date} params.end
 * @param {string|null} [params.excludeId]
 *
 * @returns {Promise<Object|null>}
 */
export async function findReservationConflict({
    catwayNumber,
    start,
    end,
    excludeId = null
}) {

    const query = {
        catwayNumber,
        startDate: { $lt: end },
        endDate: { $gt: start }
    }

    if (excludeId) {
        query._id = { $ne: excludeId };
    }
    return Reservation.findOne(query);
}