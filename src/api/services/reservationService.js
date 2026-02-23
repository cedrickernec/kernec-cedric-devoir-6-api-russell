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

export async function getAllReservationsService() {

    return getAllReservations();
}

// ===============================================
// GET RESERVATIONS BY CATWAY
// ===============================================

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
                "La sélection nécessite une confirmation par mot de passe.",
                { reason: "password_required" }
            );
        }

        const isValid = await verifyUserPassword(userId, password);

        if (!isValid) {
            throw ApiError.businessConflict(
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
            throw ApiError.businessConflict(
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