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

import {
    validateReservationPeriod,
    validateReservationUpdate
} from "../validators/reservationValidators.js";

import { parseDate } from "../utils/dates/parseDate.js";
import { normalizeDayRange } from "../utils/dates/normalizeDayRange.js";

import { ApiError } from "../utils/errors/apiError.js";
import { getAvailableCatways } from "../utils/availability/getAvailableCatway.js";
import { parseReservationPeriod } from "../utils/availability/parseReservationPeriod.js";

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
    allowPartial
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
        selectedType: catwayType !== "all" ? catwayType : null
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

    const formatErrors = validateReservationUpdate(data);

    if (Object.keys(formatErrors).length > 0) {
        throw ApiError.validation(
            formatErrors
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

    const { start, end } = parseReservationPeriod(startDate, endDate);

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

    return reservation;
}

// ===============================================
// DELETE RESERVATION
// ===============================================

export async function deleteReservationService(catwayNumber, idReservation) {

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

    if (!canDeleteReservation(reservation)) {
        throw ApiError.forbidden(
            "Impossible de supprimer une réservation en cours ou terminée."
        );
    }

    return deleteReservation(catwayNumber, idReservation);
}