/**
 * ===================================================================
 * CATWAY REPOSITORY
 * ===================================================================
 * - Lit et écrit les données uniquement :
 *      - Centralise tous les accès à la base de données
 * ===================================================================
 */

import Catway from "../models/Catway.js";
import Reservation from "../models/Reservation.js";

// ===============================================
// GET ALL CATWAYS
// ===============================================

export async function getAllCatways() {

    return Catway.find().sort({ catwayNumber: 1 });
}

// ===============================================
// FIND CATWAY BY NUMBER
// ===============================================

export async function findCatwayByNumber(catwayNumber) {

    return Catway.findOne({ catwayNumber }).select("-__v");
}

// ===============================================
// CREATE CATWAY
// ===============================================

export async function createCatway(data) {

    return Catway.create(data);
}

// ===============================================
// UPDATE CATWAY
// ===============================================

export async function updateCatwayByNumber(catwayNumber, data) {

    return Catway.findOneAndUpdate(
        { catwayNumber },
        data,
        { new: true }
    );
}

// ===============================================
// DELETE CATWAY
// ===============================================

export async function deleteCatwayByNumber(catwayNumber) {

    return Catway.findOneAndDelete({ catwayNumber });
}

// ===============================================
// CHECK CATWAY HAS RESERVATIONS
// ===============================================

export async function catwayHasReservations(catwayNumber) {
    return Reservation.findOne({ catwayNumber });
}