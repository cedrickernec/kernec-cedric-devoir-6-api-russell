/**
 * ===================================================================
 * RESERVATION CONTROLLERS
 * ===================================================================
 * - Fait le lien entre l'API et la logique métier :
 *      - Gère les requêtes HTTP
 *      - Valide les entrées via les validators
 *      - Appelle les services
 *      - Construit les réponses HTTP
 * ===================================================================
 */

import {
    getAllReservationsService,
    getReservationsByCatwayService,
    getReservationByIdService,
    getReservationAvailabilityService,
    createReservationService,
    updateReservationService,
    deleteReservationService
} from "../services/reservationService.js"

import {
    validateCatwayNumber,
    validateObjectId
} from "../validators/params/idValidator.js";

import {
    validateReservationCreate,
    validateAvailabilityInput
} from "../validators/reservationValidators.js";

import {
    formatAvailability,
    formatReservation,
    formatReservationsList
} from "../utils/formatters/reservationFormatter.js";

import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";
import { ApiError } from "../utils/errors/apiError.js";

// ===============================================
// GET ALL RESERVATIONS
// ===============================================

export const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await getAllReservationsService();

        res.status(200).json({
            success: true,
            count: reservations.length,
            message: reservations.length === 0
              ? "Aucune réservation trouvée."
              : undefined,
            data: formatReservationsList(reservations)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// GET RESERVATIONS BY CATWAY
// ===============================================

export const getReservationsByCatway = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);

        // 2) Service
        const reservations = await getReservationsByCatwayService(catwayNumber);

        // 3) Réponse
        res.status(200).json({
            success: true,
            count: reservations.length,
            message: reservations.length === 0
              ? "Aucune réservation trouvée."
              : undefined,
            data: formatReservationsList(reservations)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// GET RESERVATION BY ID
// ===============================================

export const getReservationById = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);
        const idReservation = validateObjectId(
            req.params.idReservation,
            "Identifiant réservation"
        );

        // 2) Service
        const reservation = await getReservationByIdService(catwayNumber, idReservation);

        // 3) Réponse
        res.status(200).json({
            success: true,
            data: formatReservation(reservation)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// GET AVAILABILITY 
// ===============================================

export const getReservationAvailability = async (req, res, next) => {
    try {
        // 1) Filtrage strict
        const allowedFields = [
            "startDate",
            "endDate",
            "catwayType",
            "allowPartial"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields)

        // 3) Validation
        const errors = validateAvailabilityInput(cleanData);
        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 3) Service
        const availability = await getReservationAvailabilityService(cleanData);

        // 4) Réponse
        if (availability.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Aucun catway disponible pour la période demandée.",
                data: []
            });
        }
        
        res.status(200).json({
            success: true,
            data: formatAvailability(availability)
        });

    } catch (error) {
        next(error);
    }
}

// ===============================================
// CREATE RESERVATION
// ===============================================

export const createReservation = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);

        // 2) Filtrage strict
        const allowedFields = [
            "clientName",
            "boatName",
            "startDate",
            "endDate"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields)

        // 3) Validation
        const errors = validateReservationCreate(cleanData);
        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 4) Service
        const created = await createReservationService(catwayNumber, cleanData);

        // 5) Réponse
        res.status(201).json({
            success: true,
            message: "Réservation créée avec succès.",
            data: formatReservation(created)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// UPDATE RESERVATION
// ===============================================

export const updateReservation = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);
        const idReservation = validateObjectId(
            req.params.idReservation,
            "Identifiant réservation"
        );

        // 2) Filtrage strict
        const allowedFields = [
            "clientName",
            "boatName",
            "startDate",
            "endDate"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        if (Object.keys(cleanData).length === 0) {
            throw ApiError.badRequest(
                "Aucune donnée valide à mettre à jour."
            );
        }

        // 3) Service
        const updated = await updateReservationService(
            catwayNumber,
            idReservation,
            cleanData
        );

        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Réservation mise à jour.",
            data: formatReservation(updated)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// DELETE RESERVATION
// ===============================================

export const deleteReservation = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);
        const idReservation = validateObjectId(
            req.params.idReservation,
            "Identifiant réservation"
        );

        // 2) Service
        const deleted = await deleteReservationService(catwayNumber, idReservation);

        // 3) Réponse
        res.status(200).json({
            success: true,
            message: "Réservation supprimée avec succès.",
            data: formatReservation(deleted)
        });

    } catch (error) {
        next(error);
    }
};