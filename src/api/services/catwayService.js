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
    catwayHasReservations
} from "../repositories/catwayRepo.js";

import { canDeleteCatway } from "./catwayRules.js";
import { validateCatwayUpdate } from "../validators/catwayValidators.js";

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

export async function deleteCatwayService(catwayNumber) {

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable.",
            { catwayNumber }
        );
    }

    const hasReservations = await catwayHasReservations(catwayNumber);

    if (!canDeleteCatway(hasReservations)) {
        throw ApiError.forbidden(
            "Impossible de supprimer ce catway : des réservations y sont associées."
        );
    }

    return deleteCatwayByNumber(catwayNumber);
}