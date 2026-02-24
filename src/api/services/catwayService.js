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
/**
 * @async
 * Récupère l'ensemble des catways.
 * 
 * @function getAllCatwayService
 * 
 * @returns {Promise<Array<Object>>} - Liste des catways
 */
export async function getAllCatwaysService() {

    return getAllCatways();
}

// ===============================================
// GET CATWAY BY NUMBER
// ===============================================
/**
 * @async
 * Récupère un catway par son numéro.
 *
 * @function getCatwayByNumberService
 *
 * @param {number} catwayNumber - Numéro du catway
 *
 * @returns {Promise<Object>} - Catway trouvé
 * @throws {ApiError} 404 - Catway introuvable
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

// ===============================================
// GET NEXT CATWAY NUMBER
// ===============================================
/**
 * @async
 * Calcule le prochain numéro de catway disponible (premier trou logique).
 *
 * @function findNextCatwayNumberService
 *
 * @returns {Promise<number>} - Prochain numéro disponible
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

// ===============================================
// CHECK CATWAY NUMBER AVAILABILITY
// ===============================================
/**
 * @async
 * Vérifie si un numéro de catway est disponible.
 *
 * @function checkCatwayNumberService
 *
 * @param {number|string} number - Numéro à vérifier
 * @param {string} [excludeId] - ID à exclure (cas d'une mise à jour)
 *
 * @returns {Promise<boolean>} - True si disponible
 */
export async function checkCatwayNumberService(number, excludeId) {

    if (!number) return false;

    const catwayNumberInt = Number(number);
    if (Number.isNaN(catwayNumberInt)) return false;

    const existing = await findCatwayByNumber(catwayNumberInt);

    if (!existing) return true;

    if (excludeId && existing._id.toString() === excludeId) {
        return true;
    }

    return false;
}

// ===============================================
// CREATE CATWAY
// ===============================================
/**
 * @async
 * Crée un nouveau catway après contrôle d'unicité du numéro.
 *
 * @function createCatwayService
 *
 * @param {Object} data - Données du catway
 * @param {number} data.catwayNumber
 * @param {string} data.catwayType
 * @param {string} data.catwayState
 * @param {boolean} data.isOutOfService
 *
 * @returns {Promise<Object>} - Catway créé
 * @throws {ApiError} 409 - Numéro déjà existant
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

// ===============================================
// UPDATE CATWAY
// ===============================================
/**
 * @async
 * Met à jour un catway après validation des données.
 *
 * @function updateCatwayService
 *
 * @param {number} catwayNumber - Numéro du catway à modifier
 * @param {Object} data - Données à mettre à jour
 *
 * @returns {Promise<Object>} - Catway mis à jour
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 400 - Données invalides
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

// ===============================================
// CHECK BULK DELETE CATWAYS
// ===============================================
/**
 * @async
 * Vérifie si une suppression multiple de catways nécessite une confirmation par mot de passe.
 *
 * @function checkBulkCatwaysBeforeDeleteService
 *
 * @param {Array<number|string>} ids - Liste des numéros de catways
 *
 * @returns {Promise<Object>} - { success: true } si aucune contrainte
 * @throws {ApiError} 400 - Liste invalide
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Confirmation par mot de passe requise
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
                reservationsStats: aggregatedStats
            }
        );
    }

    return { success: true };
}

// ===============================================
// BULK DELETE CATWAYS
// ===============================================
/**
 * @async
 * Supprime plusieurs catways après validation complète et éventuelle confirmation par mot de passe.
 *
 * @function deleteCatwaysBulkService
 *
 * @param {Array<number|string>} ids - Liste des numéros à supprimer
 * @param {Object} options
 * @param {string} options.userId - ID de l'utilisateur demandeur
 * @param {string} [options.password] - Mot de passe de confirmation
 *
 * @returns {Promise<{count: number}>} - Nombre de catways supprimés
 *
 * @throws {ApiError} 400 - Requête invalide
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 401 - Mot de passe incorrect
 * @throws {ApiError} 409 - Confirmation requise
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
            throw ApiError.unauthorized(
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

// ===============================================
// DELETE CATWAY
// ===============================================
/**
 * @async
 * Supprime un catway unique avec gestion des réservations liées.
 *
 * @function deleteCatwayService
 *
 * @param {number} catwayNumber - Numéro du catway à supprimer
 * @param {Object} [options]
 * @param {string} [options.userId] - ID utilisateur demandeur
 * @param {string} [options.password] - Mot de passe de confirmation
 *
 * @returns {Promise<Object>} - Détail de la suppression
 *
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 401 - Mot de passe incorrect
 * @throws {ApiError} 409 - Confirmation requise
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
        throw ApiError.unauthorized(
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