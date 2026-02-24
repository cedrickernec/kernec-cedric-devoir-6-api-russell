/**
 * ===================================================================
 * RESERVATION CONTROLLERS
 * ===================================================================
 * - Reçoit les requêtes HTTP
 * - Filtre et valide les entrées utilisateur
 * - Appelle les services métier
 * - Formate les réponses API
 * ===================================================================
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
/**
 * @async
 * Récupère l'ensemble des réservations.
 *
 * @route GET /api/reservations
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Liste des réservations
 */
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
/**
 * @async
 * Récupère les réservations associées à un catway.
 *
 * @route GET /api/catways/:id/reservations
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Liste des réservations
 * @throws {ApiError} 400 - Identifiant invalide
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

// ===============================================
// GET RESERVATION BY ID
// ===============================================
/**
 * @async
 * Récupère une réservation spécifique.
 *
 * @route GET /api/catways/:id/reservations/:idReservation
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {string} req.params.idReservation - Identifiant de la réservation
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Détail de la réservation
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
/**
 * @async
 * Vérifie la disponibilité des catways sur une période donnée.
 *
 * @route POST /api/reservations/availability
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.startDate - Date de début
 * @param {string} req.body.endDate - Date de fin
 * @param {string} [req.body.catwayType] - Type de catway
 * @param {boolean} [req.body.allowPartial] - Autorise les disponibilités partielles
 * @param {number} [req.body.catwayNumber] - Numéro spécifique
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Résultat de disponibilité
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

// ===============================================
// CREATE RESERVATION
// ===============================================
/**
 * @async
 * Crée une nouvelle réservation.
 *
 * @route POST /api/catways/:id/reservations
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {Object} req.body
 * @param {string} req.body.clientName - Nom du client
 * @param {string} req.body.boatName - Nom du bateau
 * @param {string} req.body.startDate - Date de début
 * @param {string} req.body.endDate - Date de fin
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 201 - Réservation créée
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Conflit de réservation (dates chevauchantes ou catway hors service)
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
/**
 * @async
 * Met à jour une réservation existante.
 *
 * @route PUT /api/catways/:id/reservations/:idReservation
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {string} req.params.idReservation - Identifiant de la réservation
 * @param {Object} req.body
 * @param {string} [req.body.clientName]
 * @param {string} [req.body.boatName]
 * @param {string} [req.body.startDate]
 * @param {string} [req.body.endDate]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Réservation mise à jour
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 404 - Catway/Réservation introuvable
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
// CHECK BULK RESERVATIONS BEFORE DELETE
// ===============================================
/**
 * @async
 * Vérifie les contraintes avant suppression multiple de réservations.
 *
 * @route POST /api/reservations/bulk-check
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids - Liste d'identifiants composite (catway|reservation)
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Validation réussie
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */
export const checkReservationsBeforeDelete = async (req, res, next) => {
    try {
        // 1) Validation
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Requête invalide."
            });
        }

        // 2) Parse Ids
        const parsedIds = ids.map(compositeId => {

            if (typeof compositeId !== "string" || !compositeId.includes("|")) {
                throw ApiError.badRequest("Identifiant composite invalide.");
            }

            const [rawCatwayNumber, rawReservationId] = compositeId.split("|");

            const catwayNumber = validateCatwayNumber(rawCatwayNumber);
            const reservationId = validateObjectId(rawReservationId, "Identifiant réservation");

            return { catwayNumber, reservationId };
        });

        // 3) Service
        await checkReservationsBeforeDeleteService(parsedIds);

        // 4) Réponse
        return res.json({
            success: true
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// DELETE BULK RESERVATIONS
// ===============================================
/**
 * @async
 * Supprime plusieurs réservations.
 *
 * @route DELETE /api/reservations/bulk
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids - Liste d'identifiants
 * @param {string} [req.body.password] - Mot de passe de confirmation
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Résultat de suppression
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 401 - Mot de passe invalide
 * @throws {ApiError} 404 - Réservation introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */
export const deleteReservationsBulk = async (req, res, next) => {
  try {

    // 1) Validation
    const { ids, password } = req.body;
    const userId = req.user.id;

    // 2) Parse ids
    const parsedIds = ids.map(compositeId => {

        if (typeof compositeId !== "string" || !compositeId.includes("|")) {
            throw ApiError.badRequest("Identifiant composite invalide.");
        }

        const [rawCatwayNumber, rawReservationId] = compositeId.split("|");

        const catwayNumber = validateCatwayNumber(rawCatwayNumber);
        const reservationId = validateObjectId(rawReservationId, "Identifiant réservation");

        return `${catwayNumber}|${reservationId}`;
    });

    // 3) Service
    const result = await deleteReservationsBulkService(parsedIds, {
      userId,
      password
    });

    // 4) Réponse
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// ===============================================
// DELETE RESERVATION
// ===============================================
/**
 * @async
 * Supprime une réservation.
 *
 * @route DELETE /api/catways/:id/reservations/:idReservation
 * @group Reservations
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {string} req.params.idReservation - Identifiant de la réservation
 * @param {Object} req.body
 * @param {string} [req.body.password] - Mot de passe de confirmation
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Réservation supprimée
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