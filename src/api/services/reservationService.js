/**
 * ============================================================
 * RESERVATION SERVICE
 * ============================================================
 * - Décide si une action métier est autorisée :
 *      - Contient la logique métier de l'application
 *      - Applique les règles fonctionnelles
 *      - Appelle les validators, les rules et les repositories
 * ============================================================
 */

import {
    getAllReservations,
    getReservationsByCatway,
    findReservationById,
    createReservation,
    deleteReservation,
    findReservationConflict,
    getReservationsOverlappingPeriod,
} from "../repositories/reservationRepo.js";

import {
    findCatwayByNumber,
    getAllCatways
} from "../repositories/catwayRepo.js";

import {
    canUpdateReservation,
    canDeleteReservation,
    hasReservationStarted
} from "./reservationRules.js";

import { verifyUserPassword } from "../utils/security/passwordVerifier.js";

import { parseDate } from "../utils/dates/parseDate.js";
import {
    parseReservationPeriod,
    parseReservationUpdatePeriod
} from "../utils/availability/parseReservationPeriod.js";
import { getAvailableCatways } from "../utils/availability/getAvailableCatway.js";

import { getReservationStatus } from "../utils/reservations/reservationStatus.js";
import { ApiError } from "../utils/errors/apiError.js";

// ===============================================
// GET ALL RESERVATION
// ===============================================
/**
 * @async
 * Récupère l'ensemble des réservations.
 *
 * @function getAllReservationsService
 *
 * @returns {Promise<Array<Object>>} - Liste des réservations
 */
export async function getAllReservationsService() {

    return getAllReservations();
}

// ===============================================
// GET RESERVATIONS BY CATWAY
// ===============================================
/**
 * @async
 * Récupère toutes les réservations d'un catway donné.
 *
 * @function getReservationsByCatwayService
 *
 * @param {number} catwayNumber - Numéro du catway
 *
 * @returns {Promise<Array<Object>>} - Liste des réservations du catway
 * @throws {ApiError} 404 - Catway introuvable
 */
export async function getReservationsByCatwayService(catwayNumber) {

    const catway = await findCatwayByNumber(catwayNumber);

    if(!catway) {
        throw ApiError.notFound(
            "Catway introuvable.",
            { catwayNumber }
        );
    }

    return getReservationsByCatway(catwayNumber);
}

// ===============================================
// GET RESERVATION BY ID
// ===============================================
/**
 * @async
 * Récupère une réservation spécifique d'un catway.
 *
 * @function getReservationByIdService
 *
 * @param {number} catwayNumber - Numéro du catway
 * @param {string} idReservation - Identifiant de la réservation
 *
 * @returns {Promise<Object>} - { reservation, catway }
 * @throws {ApiError} 404 - Catway ou réservation introuvable
 */
export async function getReservationByIdService(catwayNumber, idReservation) {

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable",
            { catwayNumber }
        );
    }

    const reservation = await findReservationById(catwayNumber, idReservation);

    if (!reservation) {
        throw ApiError.notFound(
            "Réservation introuvable.",
            { catwayNumber, idReservation }
        );
    }

    return { reservation, catway };
}

// ===============================================
// GET AVAILABILITY
// ===============================================
/**
 * @async
 * Recherche les catways disponibles sur une période donnée.
 *
 * @function getReservationAvailabilityService
 *
 * @param {Object} options
 * @param {string} options.startDate - Date de début (YYYY-MM-DD)
 * @param {string} options.endDate - Date de fin (YYYY-MM-DD)
 * @param {string} [options.catwayType] - Type de catway filtré
 * @param {boolean} [options.allowPartial] - Autorise disponibilité partielle
 * @param {number|string} [options.catwayNumber] - Catway spécifique
 *
 * @returns {Promise<Array<Object>>} - Liste des disponibilités calculées
 */
export async function getReservationAvailabilityService({
    startDate,
    endDate,
    catwayType,
    allowPartial,
    catwayNumber
}) {

    const { start, end } = parseReservationPeriod(startDate, endDate);

    const reservations = await getReservationsOverlappingPeriod({ start, end });
    const catways = await getAllCatways();

    return getAvailableCatways({
        catways,
        reservations,
        startDate: start,
        endDate: end,
        allowPartial: Boolean(allowPartial),
        selectedType: catwayType !== "all" ? catwayType : null,
        selectedCatwayNumber: catwayNumber ? Number(catwayNumber) : null
    });
}

// ===============================================
// CREATE RESERVATION
// ===============================================
/**
 * @async
 * Crée une réservation après contrôle de disponibilité et état du catway.
 *
 * @function createReservationService
 *
 * @param {number} catwayNumber - Numéro du catway
 * @param {Object} data - Données de réservation
 * @param {string} data.clientName
 * @param {string} data.boatName
 * @param {string} data.startDate
 * @param {string} data.endDate
 *
 * @returns {Promise<Object>} - { reservation, catway }
 *
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Conflit de réservation
 * @throws {ApiError} 409 - Catway hors service
 */
export async function createReservationService(catwayNumber, data) {

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable",
            { catwayNumber }
        );
    }

    if (catway.isUnavailable()) {
        throw ApiError.businessConflict(
            "Catway hors service.",
            {
                catwayNumber: catwayNumber,
                isOutOfService: catway.isOutOfService,
                catwayState: catway.catwayState
            }
        );
    }
    
    const { start, end } = parseReservationPeriod(data.startDate, data.endDate);

    const conflict = await findReservationConflict({ catwayNumber, start, end });

    if (conflict) {
        throw ApiError.resourceConflict(
            "Ce catway est déjà réservé sur ce créneau.",
            { reservation: {
                id: conflict._id,
                clientName: conflict.clientName,
                boatName: conflict.boatName,
                startDate: conflict.startDate,
                endDate: conflict.endDate,
                createdAt: conflict.createdAt,
                updatedAt: conflict.updatedAt
                }
            }
        );
    }

    const reservation = await createReservation({
        catwayNumber,
        clientName: data.clientName,
        boatName: data.boatName,
        startDate: start,
        endDate: end  
    })

    return { reservation, catway };
}

// ===============================================
// UPDATE RESERVATION
// ===============================================
/**
 * @async
 * Met à jour une réservation après validation métier.
 *
 * @function updateReservationService
 *
 * @param {number} catwayNumber - Numéro du catway
 * @param {string} idReservation - Identifiant de la réservation
 * @param {Object} data - Données à mettre à jour
 *
 * @returns {Promise<Object>} - { reservation, catway }
 *
 * @throws {ApiError} 404 - Catway ou réservation introuvable
 * @throws {ApiError} 403 - Modification interdite (réservation terminée)
 * @throws {ApiError} 409 - Conflit de réservation
 */
export async function updateReservationService(catwayNumber, idReservation, data) {

    const catway = await findCatwayByNumber(catwayNumber);

    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable",
            { catwayNumber }
        );
    }

    const reservation = await findReservationById(catwayNumber, idReservation);

    if (!reservation) {
        throw ApiError.notFound(
            "Réservation introuvable.",
            { catwayNumber, idReservation }
        );
    }

    if (!canUpdateReservation(reservation)) {
        throw ApiError.forbidden(
            "Cette réservation est terminée et ne peut plus être modifiée."
        );
    }

    if (hasReservationStarted(reservation) && data.startDate) {

        const attemptedStart = parseDate(data.startDate);

        if (attemptedStart.getTime() !== reservation.startDate.getTime()) {
            throw ApiError.forbidden(
                "La date de début ne peut plus être modifiée une fois la réservation commencée."
            );
        }
    }

    const { start, end } = parseReservationUpdatePeriod(
        reservation.startDate,
        reservation.endDate,
        data.startDate,
        data.endDate
    );

    const conflict = await findReservationConflict({
        catwayNumber,
        start,
        end,
        excludeId: reservation._id
    })

    if (conflict) {
        throw ApiError.resourceConflict(
            "Ce catway est déjà réservé sur ce créneau.",
            { reservation: {
                id: conflict._id,
                clientName: conflict.clientName,
                boatName: conflict.boatName,
                startDate: conflict.startDate,
                endDate: conflict.endDate,
                createdAt: conflict.createdAt,
                updatedAt: conflict.updatedAt
                }
            }
        );
    }

    reservation.clientName = data.clientName ?? reservation.clientName;
    reservation.boatName = data.boatName ?? reservation.boatName;
    reservation.startDate = start;
    reservation.endDate = end;

    await reservation.save();

    return { reservation, catway };
}

// ===============================================
// CHECK BULK DELETE RESERVATIONS
// ===============================================
/**
 * @async
 * Vérifie si une suppression multiple de réservations nécessite une confirmation par mot de passe.
 *
 * @function checkReservationsBeforeDeleteService
 *
 * @param {Array<{catwayNumber: number, reservationId: string}>} ids
 *
 * @returns {Promise<boolean>} - true si aucune contrainte
 *
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 409 - Confirmation par mot de passe requise
 */
export async function checkReservationsBeforeDeleteService(ids) {

    for (const { catwayNumber, reservationId } of ids) {

        const reservation = await findReservationById(catwayNumber, reservationId);

        if (!reservation) {
            throw ApiError.notFound(
                "Réservation introuvable.",
                { catwayNumber, reservationId }
            );
        }

        if (!canDeleteReservation(reservation)) {

            const status = getReservationStatus(reservation);

            throw ApiError.businessConflict(
                "Au moins une réservation nécessite une confirmation par mot de passe.",
                {
                    reason: "password_required",
                    status,
                    clientName: reservation.clientName,
                    boatName: reservation.boatName,
                    startDate: reservation.startDate,
                    endDate: reservation.endDate
                }
            );
        }
    }

    return true;
}

// ===============================================
// BULK DELETE RESERVATIONS
// ===============================================
/**
 * @async
 * Supprime plusieurs réservations après validation complète.
 *
 * @function deleteReservationsBulkService
 *
 * @param {Array<string>} ids - Identifiants composites "catwayNumber|reservationId"
 * @param {Object} options
 * @param {string} options.userId - ID utilisateur demandeur
 * @param {string} [options.password] - Mot de passe de confirmation
 *
 * @returns {Promise<{count: number}>} - Nombre de réservations supprimées
 *
 * @throws {ApiError} 400 - Requête invalide
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 401 - Mot de passe incorrect
 * @throws {ApiError} 409 - Confirmation requise
 */
export async function deleteReservationsBulkService(ids, { userId, password }) {

    if (!Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest("Requête invalide.");
    }

    // 1) Parsing des IDs
    const parsed = ids.map(compositeId => {
        const [catwayNumber, reservationId] = compositeId.split("|");
        return { catwayNumber, reservationId };
    });

    // 2) Récupération + validation complète avant suppression
    const reservations = [];
    let requiresPassword = false;

    for (const { catwayNumber, reservationId } of parsed) {

        const reservation = await findReservationById(catwayNumber, reservationId);

        if (!reservation) {
            throw ApiError.notFound(
                "Réservation introuvable.",
                { catwayNumber, reservationId }
            );
        }

        // Stockage
        reservations.push(reservation);

        // Détection : password nécessaire ?
        if (!canDeleteReservation(reservation)) {
            requiresPassword = true;
        }
    }

    // 3) Vérification password une seule fois
    if (requiresPassword) {

        if (!password) {
            throw ApiError.businessConflict(
                "La sélection contient des réservations en cours ou terminée. La suppression nécessite une confirmation par mot de passe.",
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
    for (const reservation of reservations) {
        await deleteReservation(
            reservation.catwayNumber,
            reservation._id
        );
    }

    return {
        count: reservations.length
    };
}

// ===============================================
// DELETE RESERVATION
// ===============================================
/**
 * @async
 * Supprime une réservation unique avec gestion des règles métier.
 *
 * @function deleteReservationService
 *
 * @param {number} catwayNumber - Numéro du catway
 * @param {string} idReservation - Identifiant de la réservation
 * @param {Object} [options]
 * @param {string} [options.userId] - ID utilisateur demandeur
 * @param {string} [options.password] - Mot de passe de confirmation
 *
 * @returns {Promise<Object>} - { reservation, catway }
 *
 * @throws {ApiError} 404 - Catway ou réservation introuvable
 * @throws {ApiError} 401 - Mot de passe incorrect
 * @throws {ApiError} 409 - Confirmation requise
 */
export async function deleteReservationService(catwayNumber, idReservation, options = {}) {

    const { userId, password } = options;
    const catway = await findCatwayByNumber(catwayNumber);
    
    if (!catway) {
        throw ApiError.notFound(
            "Catway introuvable",
            { catwayNumber }
        );
    }
    
    const reservation = await findReservationById(catwayNumber, idReservation);
    
    if (!reservation) {
        throw ApiError.notFound(
            "Réservation introuvable.",
            { catwayNumber, idReservation }
        );
    }

    const status = getReservationStatus(reservation);

    if (!canDeleteReservation(reservation)) {
        
        if (!password) {
            throw ApiError.businessConflict(
                `Réservation en cours ou terminée. La suppression nécessite une confirmation par mot de passe.`,
                {
                    reason: "password_required",
                    status,
                    clientName: reservation.clientName,
                    boatName: reservation.boatName,
                    startDate: reservation.startDate,
                    endDate: reservation.endDate
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
    }

    const deleted = await deleteReservation(catwayNumber, idReservation)

    return {
        reservation: deleted,
        catway
    };
}