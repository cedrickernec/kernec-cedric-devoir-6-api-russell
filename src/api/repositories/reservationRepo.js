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

export async function getAllReservations() {

    return Reservation.find().sort({ startDate: -1 });
}

// ===============================================
// GET RESERVATIONS BY CATWAY
// ===============================================

export async function getReservationsByCatway(catwayNumber) {

    return Reservation.find({ catwayNumber }).sort({ startDate: -1 });
}

// ===============================================
// FIND RESERVATION BY ID
// ===============================================

export async function findReservationById(catwayNumber, idReservation) {

    return Reservation.findOne({ _id: idReservation, catwayNumber });
}

// ===============================================
// CREATE RESERVATION
// ===============================================

export async function createReservation(data) {

    return Reservation.create(data);
}

// ===============================================
// DELETE RESERVATION
// ===============================================

export async function deleteReservation(catwayNumber, idReservation) {

    return Reservation.findOneAndDelete({ catwayNumber, _id: idReservation });
}

// ===============================================
// FIND RESERVATION CONFLICT
// ===============================================

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