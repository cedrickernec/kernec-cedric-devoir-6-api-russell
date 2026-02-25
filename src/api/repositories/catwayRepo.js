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
/**
 * Récupère tous les catways.
 *
 * @async
 * @function getAllCatways
 *
 * @returns {Promise<Object[]>}
 */
export async function getAllCatways() {

    return Catway.find().sort({ catwayNumber: 1 });
}

// ===============================================
// FIND CATWAY BY NUMBER
// ===============================================
/**
 * Recherche un catway par numéro.
 *
 * @async
 * @function findCatwayByNumber
 *
 * @param {number|string} catwayNumber
 *
 * @returns {Promise<Object|null>}
 */
export async function findCatwayByNumber(catwayNumber) {

    return Catway.findOne({ catwayNumber }).select("-__v");
}

// ===============================================
// CREATE CATWAY
// ===============================================
/**
 * Crée un nouveau catway.
 *
 * @async
 * @function createCatway
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>}
 */
export async function createCatway(data) {

    return Catway.create(data);
}

// ===============================================
// UPDATE CATWAY
// ===============================================
/**
 * Met à jour un catway par numéro.
 *
 * @async
 * @function updateCatwayByNumber
 *
 * @param {number|string} catwayNumber
 * @param {Object} data
 *
 * @returns {Promise<Object|null>}
 */
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
/**
 * Supprime un catway par numéro.
 *
 * @async
 * @function deleteCatwayByNumber
 *
 * @param {number|string} catwayNumber
 *
 * @returns {Promise<Object|null>}
 */
export async function deleteCatwayByNumber(catwayNumber) {

    return Catway.findOneAndDelete({ catwayNumber });
}

// ===============================================
// CHECK CATWAY HAS RESERVATIONS
// ===============================================
/**
 * Vérifie si un catway possède au moins une réservation.
 *
 * @async
 * @function catwayHasReservations
 *
 * @param {number|string} catwayNumber
 *
 * @returns {Promise<Object|null>}
 */
export async function catwayHasReservations(catwayNumber) {
    return Reservation.findOne({ catwayNumber });
}

// ===============================================
// DELETE ALL RESERVATION BY CATWAY
// ===============================================
/**
 * Supprime toutes les réservations d'un catway.
 *
 * @async
 * @function deleteAllReservationsByCatway
 *
 * @param {number|string} catwayNumber
 *
 * @returns {Promise<Object>}
 */
export async function deleteAllReservationsByCatway(catwayNumber) {

    return Reservation.deleteMany({ catwayNumber });
}
