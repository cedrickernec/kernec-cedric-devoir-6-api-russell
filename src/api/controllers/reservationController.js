/**
 * RESERVATION CONTROLLERS
 * =========================================================================================
 * @module reservationController
 *
 * Contrôleurs HTTP liés aux réservations.
 *
 * Responsabilités :
 * - Valider les identifiants (catway / reservation)
 * - Filtrer strictement les données entrantes
 * - Orchestrer les services métier réservation
 * - Normaliser les réponses JSON API
 *
 * Déclenché par :
 * - Routes /api/reservations/*
 * - Routes /api/catways/:id/reservations/*
 *
 * Dépendances :
 * - reservationService
 * - reservationValidators
 * - reservationFormatter
 * - ApiError
 *
 * Sécurité :
 * - Validation stricte des ObjectId et numéros de catway
 * - Filtrage des champs autorisés
 * - Vérification des conflits de dates
 *
 * Effets de bord :
 * - Création, modification et suppression persistante de réservations
 */

import {
    getAllReservationsService,
    getReservationsByCatwayService,
    getReservationByIdService,
    getReservationAvailabilityService,
    createReservationService,
    updateReservationService,
    checkReservationsBeforeDeleteService,
    deleteReservationsBulkService,
    deleteReservationService
} from "../services/reservationService.js"

import {
    validateCatwayNumber,
    validateObjectId
} from "../validators/params/idValidator.js";

import {
    validateReservationCreate,
    validateReservationUpdate,
    validateAvailabilityInput
} from "../validators/reservationValidators.js";

import {
    formatAvailability,
    formatReservation,
    formatReservationsList
} from "../utils/formatters/reservationFormatter.js";

import { parseCompositeIds } from "../utils/parsers/parseCompositeIds.js";

import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";
import { ApiError } from "../utils/errors/apiError.js";

/**
 * GET ALL RESERVATIONS
 * =========================================================================================
 * Retourne l’ensemble des réservations.
 *
 * @async
 * @function getAllReservations
 * @route GET /api/reservations
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

export const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await getAllReservationsService();

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: formatReservationsList(reservations)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET RESERVATIONS BY CATWAY
 * =========================================================================================
 * Retourne les réservations associées à un catway.
 *
 * @async
 * @function getReservationsByCatway
 * @route GET /api/catways/:id/reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Numéro de catway invalide
 * @throws {ApiError} 404 - Catway introuvable
 */

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

/**
 * GET RESERVATION BY ID
 * =========================================================================================
 * Retourne le détail d’une réservation spécifique.
 *
 * @async
 * @function getReservationById
 * @route GET /api/catways/:id/reservations/:idReservation
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {string} req.params.idReservation
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 404 - Réservation introuvable
 */

export const getReservationById = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);
        const idReservation = validateObjectId(
            req.params.idReservation,
            "Identifiant réservation"
        );

        // 2) Service
        const result = await getReservationByIdService(catwayNumber, idReservation);

        // 3) Réponse
        res.status(200).json({
            success: true,
            data: formatReservation(result)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET RESERVATION AVAILABILITY
 * =========================================================================================
 * Vérifie la disponibilité des catways sur une période donnée.
 *
 * @async
 * @function getReservationAvailability
 * @route POST /api/reservations/availability
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.startDate
 * @param {string} req.body.endDate
 * @param {string} [req.body.catwayType]
 * @param {boolean} [req.body.allowPartial]
 * @param {number} [req.body.catwayNumber]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 */

export const getReservationAvailability = async (req, res, next) => {
    try {
        // 1) Filtrage strict
        const allowedFields = [
            "startDate",
            "endDate",
            "catwayType",
            "allowPartial",
            "catwayNumber"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

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

/**
 * CREATE RESERVATION
 * =========================================================================================
 * Crée une nouvelle réservation pour un catway.
 *
 * @async
 * @function createReservation
 * @route POST /api/catways/:id/reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {Object} req.body
 * @param {string} req.body.clientName
 * @param {string} req.body.boatName
 * @param {string} req.body.startDate
 * @param {string} req.body.endDate
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Conflit de réservation
 */

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

        // 3) Normalisation
        if (typeof cleanData.clientName === "string") {
            cleanData.clientName = cleanData.clientName.trim();
        }

        if (typeof cleanData.boatName === "string") {
            cleanData.boatName = cleanData.boatName.trim();
        }

        // 4) Validation
        const errors = validateReservationCreate(cleanData);
        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 5) Service
        const created = await createReservationService(catwayNumber, cleanData);

        // 6) Réponse
        res.status(201).json({
            success: true,
            message: "Réservation créée avec succès.",
            data: formatReservation(created)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * UPDATE RESERVATION
 * =========================================================================================
 * Met à jour une réservation existante.
 *
 * @async
 * @function updateReservation
 * @route PUT /api/catways/:id/reservations/:idReservation
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {string} req.params.idReservation
 * @param {Object} req.body
 * @param {string} [req.body.clientName]
 * @param {string} [req.body.boatName]
 * @param {string} [req.body.startDate]
 * @param {string} [req.body.endDate]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 404 - Ressource introuvable
 * @throws {ApiError} 409 - Conflit de dates
 */

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

        // 3) Normalisation
        if (typeof cleanData.clientName === "string") {
            cleanData.clientName = cleanData.clientName.trim();
        }

        if (typeof cleanData.boatName === "string") {
            cleanData.boatName = cleanData.boatName.trim();
        }

        // 4) Validation
        if (Object.keys(cleanData).length === 0) {
            throw ApiError.badRequest(
                "Aucune donnée valide à mettre à jour."
            );
        }

        const errors = validateReservationUpdate(cleanData);

        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 5) Service
        const updated = await updateReservationService(
            catwayNumber,
            idReservation,
            cleanData
        );

        // 6) Réponse
        res.status(200).json({
            success: true,
            message: "Réservation mise à jour.",
            data: formatReservation(updated)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * CHECK BULK RESERVATIONS BEFORE DELETE
 * =========================================================================================
 * Vérifie les contraintes avant suppression multiple de réservations.
 *
 * @async
 * @function checkReservationsBeforeDelete
 * @route POST /api/reservations/bulk-check
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids - Format composite "catway|reservation"
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant composite invalide
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */

export const checkReservationsBeforeDelete = async (req, res, next) => {
    try {

        // 1) Extraction
        const { ids } = req.body;

        // 2) Parse Ids
        const parsedIds = parseCompositeIds(ids);

        // 3) Service
        const result = await checkReservationsBeforeDeleteService(parsedIds);

        // 4) Réponse
        return res.json({
            success: true,
            requiresPassword: result.requiresPassword
        });

    } catch (error) {
        next(error);
    }
};

/**
 * DELETE RESERVATIONS BULK
 * =========================================================================================
 * Supprime plusieurs réservations.
 *
 * @async
 * @function deleteReservationsBulk
 * @route DELETE /api/reservations/bulk
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids
 * @param {string} [req.body.password]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 401 - Mot de passe invalide
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */

export const deleteReservationsBulk = async (req, res, next) => {
  try {

    // 1) Extraction
    const { ids, password } = req.body;
    const userId = req.user.id;

    // 2) Parse Ids
    const parsedIds = parseCompositeIds(ids);

    // 3) Service
    const result = await deleteReservationsBulkService(parsedIds, {
      userId,
      password
    });

    // 4) Reponse
    const count = result.count;
    const reservationLabel = count > 1 ? "réservations" : "réservation";
    const deletedLabel = count > 1 ? "supprimées" : "supprimée";
    
    res.status(200).json({
      success: true,
      message: `${count} ${reservationLabel} ${deletedLabel} avec succès.`,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE RESERVATION
 * =========================================================================================
 * Supprime une réservation spécifique.
 *
 * @async
 * @function deleteReservation
 * @route DELETE /api/catways/:id/reservations/:idReservation
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {string} req.params.idReservation
 * @param {Object} req.body
 * @param {string} [req.body.password]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 401 - Mot de passe invalide
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */

export const deleteReservation = async (req, res, next) => {
    try {
        // 1) Validation IDs
        const catwayNumber = validateCatwayNumber(req.params.id);
        const idReservation = validateObjectId(
            req.params.idReservation,
            "Identifiant réservation"
        );

        // 2) Récupération du password éventuel et de l'utilisateur courant
        const { password } = req.body || {};
        const userId = req.user.id;

        // 3) Service
        const deleted = await deleteReservationService(
            catwayNumber,
            idReservation,
            {
                userId,
                password
            }
        );

        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Réservation supprimée avec succès.",
            data: formatReservation(deleted)
        });

    } catch (error) {
        next(error);
    }
};