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

import {
    canUpdateCatwayNumber,
    canUpdateCatwayType,
    canDeleteCatway
} from "./catwayRules.js";

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
        throw new ApiError(
            404,
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
        throw new ApiError(
            400,
            "Un catway avec ce numéro existe déjà.",
            { existingCatway: existing }
        );
    }

    return createCatway(data);
}

// ===============================================
// UPDATE CATWAY
// ===============================================

export async function updateCatwayService(catwayNumber, rawBody, data) {

    if (!canUpdateCatwayNumber(rawBody) || !canUpdateCatwayType(rawBody)) {
        throw new ApiError(
            400,
            "Le numéro et le type de catway ne peuvent être modifiés."
        );
    }

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw new ApiError(
            404,
            "Catway introuvable.",
            { catwayNumber }
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
        throw new ApiError(
            404,
            "Catway introuvable.",
            { catwayNumber }
        );
    }

    const hasReservations = await catwayHasReservations(catwayNumber);

    if (!canDeleteCatway(hasReservations)) {
        throw new ApiError(
            403,
            "Impossible de supprimer ce catway : des réservations y sont associées."
        );
    }

    return deleteCatwayByNumber(catwayNumber);
}