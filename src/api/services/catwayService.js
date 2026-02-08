/**
 * ============================================================
 * CATWAY SERVICE
 * ============================================================
 * - Décide si une action métier est autorisée :
 *      - Contient la logique métier de l'application
 *      - Applique les règles fonctionnelles
 *      - Appelle les validators, les rules et les repositories
 * ============================================================
 */

import {
    getAllCatways,
    findCatwayByNumber,
    createCatway,
    updateCatwayByNumber,
    deleteCatwayByNumber,
    catwayHasReservations,
    deleteAllReservationsByCatway
} from "../repositories/catwayRepo.js";

import { getReservationsByCatway } from "../repositories/reservationRepo.js";
import { computeReservationStats } from "../utils/reservations/reservationStats.js";

import { validateCatwayUpdate } from "../validators/catwayValidators.js";
import { verifyUserPassword } from "../utils/security/passwordVerifier.js";

import { ApiError } from "../utils/errors/apiError.js";

// ===============================================
// GET ALL CATWAYS
// ===============================================

export async function getAllCatwaysService() {

    return getAllCatways();
}

// ===============================================
// GET CATWAY BY NUMBER
// ===============================================

export async function getCatwayByNumberService(catwayNumber) {

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable.",
            { catwayNumber }
        );
    }

    return catway;
}

// ===============================================
// CREATE CATWAY
// ===============================================

export async function createCatwayService(data) {

    const existing = await findCatwayByNumber(data.catwayNumber);

    if (existing) {
        throw ApiError.fieldConflict(
            "catwayNumber",
            "Un catway avec ce numéro existe déjà.",
            { catway: {
                id: existing._id,
                catwayNumber: existing.catwayNumber,
                catwayType: existing.catwayType,
                catwayState: existing.catwayState,
                isOutOfService: existing.isOutOfService,
                createdAt: existing.createdAt,
                updatedAt: existing.updatedAt
                }
            }
        );
    }

    return createCatway(data);
}

// ===============================================
// UPDATE CATWAY
// ===============================================

export async function updateCatwayService(catwayNumber, data) {

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable.",
            { catwayNumber }
        );
    }

    const errors = validateCatwayUpdate(data);
    if (Object.keys(errors).length > 0) {
        throw ApiError.validation(
            errors
        );
    }

    return updateCatwayByNumber(catwayNumber, data);
}

// ===============================================
// DELETE CATWAY
// ===============================================

export async function deleteCatwayService(catwayNumber, options = {}) {

    const { userId, password } = options;
    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable.",
            { catwayNumber }
        );
    }

    const hasReservations = await catwayHasReservations(catwayNumber);

    if (!hasReservations) {
        
        const deletedCatway = await deleteCatwayByNumber(catwayNumber);

        return {
            catway: deletedCatway
        };
    }
    
    const reservations = await getReservationsByCatway(catwayNumber);
    const reservationsStats = computeReservationStats(reservations);

    if (!password) {

        throw ApiError.businessConflict(
            "Ce catway contient des réservations. La suppression nécessite une confirmation par mot de passe.",
            {
                reason: "password_required",
                catwayNumber,
                reservationsLinked: true,
                reservationsStats
            }
        );
    }

    const isValid = await verifyUserPassword(userId, password);
    if (!isValid) {
        throw ApiError.businessConflict(
            "Mot de passe incorrect.",
            {
                reason: "invalid_password"
            }
        )
    }

    await deleteAllReservationsByCatway(catwayNumber);

    const deletedCatway = await deleteCatwayByNumber(catwayNumber);

    return {
        catway: deletedCatway,
        reservationsDeleted: reservationsStats
    };
}