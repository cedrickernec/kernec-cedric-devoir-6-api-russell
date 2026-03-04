/**
 * CATWAY SERVICE
 * =========================================================================================
 * @module catwayService
 *
 * Porte la logique métier des catways.
 *
 * Fonctionnalités :
 * - Consultation (liste, détail)
 * - Création / mise à jour
 * - Suppression simple et suppression bulk (avec gestion des réservations liées)
 * - Calcul du prochain numéro disponible
 * - Vérification de disponibilité d’un numéro
 *
 * Dépendances :
 * - catwayRepo (CRUD catways + liens réservations)
 * - reservationRepo (lecture réservations par catway)
 * - validators (validateCatwayUpdate)
 * - security (verifyUserPassword)
 * - reservationStats (computeReservationStats)
 * - ApiError
 *
 * Sécurité :
 * - Certaines suppressions requièrent confirmation par mot de passe si réservations liées
 *
 * Effets de bord :
 * - Suppressions en cascade possibles (réservations liées)
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

/**
 * GET ALL CATWAYS
 * =========================================================================================
 * Retourne la liste complète des catways.
 *
 * @async
 * @function getAllCatwaysService
 *
 * @returns {Promise<Array<Object>>}
 */

export async function getAllCatwaysService() {

    return getAllCatways();
}

/**
 * GET CATWAY BY NUMBER
 * =========================================================================================
 * Retourne un catway par son numéro.
 *
 * @async
 * @function getCatwayByNumberService
 *
 * @param {number} catwayNumber
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 404 Catway introuvable
 */

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

/**
 * GET NEXT CATWAY NUMBER
 * =========================================================================================
 * Calcule le prochain numéro disponible (premier “trou logique” dans la séquence).
 *
 * @async
 * @function findNextCatwayNumberService
 *
 * @returns {Promise<number>}
 */

export async function findNextCatwayNumberService() {

    // Récupération des numéros existants
    const catways = await getAllCatways();

    let expected = 1;

    // Recherche du premier trou dans la séquence
    for (const catway of catways) {
        if (catway.catwayNumber !== expected) {
            return expected;
        }
        expected++;
    }

    // Aucun trou → prochain numéro logique
    return expected;
}

/**
 * CHECK CATWAY NUMBER AVAILABILITY
 * =========================================================================================
 * Vérifie si un numéro de catway est disponible.
 *
 * @async
 * @function checkCatwayNumberService
 *
 * @param {number|string} catwayNumber Numéro à vérifier
 * @param {string} [excludeId] Identifiant à exclure (cas mise à jour)
 *
 * @returns {Promise<boolean>}
 */

export async function checkCatwayNumberService(catwayNumber) {

    if (!catwayNumber) return false;

    const catwayNumberInt = Number(catwayNumber);
    if (Number.isNaN(catwayNumberInt)) return false;

    const existing = await findCatwayByNumber(catwayNumberInt);

    return !existing;
}

/**
 * CREATE CATWAY
 * =========================================================================================
 * Crée un catway après contrôle d’unicité.
 *
 * @async
 * @function createCatwayService
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 409 Conflit d’unicité (numéro déjà utilisé)
 */

export async function createCatwayService(data) {

    const existing = await findCatwayByNumber(data.catwayNumber);

    if (existing) {
        throw ApiError.fieldConflict(
            "Impossible de créer le catway.",
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

/**
 * UPDATE CATWAY
 * =========================================================================================
 * Met à jour un catway après validation des données.
 *
 * @async
 * @function updateCatwayService
 *
 * @param {number} catwayNumber
 * @param {Object} data
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 404 Catway introuvable
 * @throws {ApiError} 400 Données invalides
 */

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

/**
 * CHECK BULK DELETE CATWAYS
 * =========================================================================================
 * Vérifie les contraintes avant suppression multiple.
 *
 * @async
 * @function checkBulkCatwaysBeforeDeleteService
 *
 * @param {Array<number|string>} ids
 *
 * @returns {Promise<{success: true}>}
 *
 * @throws {ApiError} 400 Liste invalide
 * @throws {ApiError} 404 Catway introuvable
 * @throws {ApiError} 409 Confirmation mot de passe requise (réservations liées)
 */

export async function checkBulkCatwaysBeforeDeleteService(ids) {

    if (!Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest("Liste invalide.");
    }

    let requiresPassword = false;

    let aggregatedStats = {
        upComing: 0,
        inProgress: 0,
        finished: 0
    };

    const parsedIds = ids.map(rawId => {
        const number = Number(rawId);

        if (Number.isNaN(number)) {
            throw ApiError.badRequest(
                "Numéro de catway invalide.",
                { value: rawId }
            );
        }

        return number;
    });

    for (const catwayNumber of parsedIds) {

        const catway = await findCatwayByNumber(catwayNumber);

        if (!catway) {
            throw ApiError.notFound(
                "Catway introuvable.",
                { catwayNumber }
            );
        }

        const hasReservations = await catwayHasReservations(catwayNumber);

        if (hasReservations) {
            requiresPassword = true;

            const reservations = await getReservationsByCatway(catwayNumber);
            const stats = computeReservationStats(reservations);

            aggregatedStats.upComing += stats.upComing;
            aggregatedStats.inProgress += stats.inProgress;
            aggregatedStats.finished += stats.finished;
        }
    }

    if (requiresPassword) {
        throw ApiError.businessConflict(
            "La sélection contient des catways liés à des réservations.",
            {
                reason: "password_required",
                reservationsLinked: true,
                reservationsStats: aggregatedStats
            }
        );
    }

    return { success: true };
}

/**
 * BULK DELETE CATWAYS
 * =========================================================================================
 * Supprime plusieurs catways avec validation et confirmation mot de passe si nécessaire.
 *
 * @async
 * @function deleteCatwaysBulkService
 *
 * @param {Array<number|string>} ids
 * @param {Object} options
 * @param {string} options.userId
 * @param {string} [options.password]
 *
 * @returns {Promise<{count: number}>}
 *
 * @throws {ApiError} 400 Requête invalide
 * @throws {ApiError} 404 Catway introuvable
 * @throws {ApiError} 403 Mot de passe incorrect
 * @throws {ApiError} 409 Confirmation requise
 */

export async function deleteCatwaysBulkService(ids, { userId, password }) {

    if (!Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest("Requête invalide.");
    }

    // 1) Parsing des IDs
    const parsedIds = ids.map(rawId => {
        const number = Number(rawId);

        if (Number.isNaN(number)) {
            throw ApiError.badRequest(
                "Numéro de catway invalide.",
                { value: rawId }
            );
        }

        return number;
    });

    // 2) Récupération + validation complète avant suppression
    const catways = [];
    let requiresPassword = false;

    for (const catwayNumber of parsedIds) {

        const catway = await findCatwayByNumber(catwayNumber);

        if (!catway) {
            throw ApiError.notFound(
                "Catway introuvable.",
                { catwayNumber }
            );
        }

        const hasReservations = await catwayHasReservations(catwayNumber);

        if (hasReservations) {
            requiresPassword = true;
        }

        // Stockage
        catways.push(catway);
    }

    // 3) Vérification password une seule fois
    if (requiresPassword) {

        if (!password) {
            throw ApiError.businessConflict(
                "La sélection contient des catways liés à des réservations. La suppression nécessite une confirmation par mot de passe.",
                { reason: "password_required" }
            );
        }

        const isValid = await verifyUserPassword(userId, password);

        if (!isValid) {
            throw ApiError.forbidden(
                "Mot de passe incorrect.",
                { reason: "invalid_password" }
            );
        }
    }

    // 4) Suppression effective (après validation complète)
    for (const catway of catways) {

        if (await catwayHasReservations(catway.catwayNumber)) {
            await deleteAllReservationsByCatway(catway.catwayNumber);
        }

        await deleteCatwayByNumber(catway.catwayNumber);
    }

    return {
        count: catways.length
    };
}

/**
 * DELETE CATWAY
 * =========================================================================================
 * Supprime un catway unique, avec suppression des réservations liées si nécessaire.
 *
 * @async
 * @function deleteCatwayService
 *
 * @param {number} catwayNumber
 * @param {Object} [options]
 * @param {string} [options.userId]
 * @param {string} [options.password]
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 404 Catway introuvable
 * @throws {ApiError} 403 Mot de passe incorrect
 * @throws {ApiError} 409 Confirmation requise
 */

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
        throw ApiError.forbidden(
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