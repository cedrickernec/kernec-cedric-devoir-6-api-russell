/**
 * CATWAY CONTROLLERS
 * =========================================================================================
 * @module catwayController
 *
 * Contrôleurs HTTP liés aux catways.
 *
 * Responsabilités :
 * - Valider et filtrer les entrées utilisateur
 * - Orchestrer les services métier catway
 * - Formater les réponses API normalisées
 *
 * Déclenché par :
 * - Routes /api/catways/*
 *
 * Dépendances :
 * - catwayService
 * - catwayValidators
 * - catwayFormatter
 * - ApiError
 *
 * Sécurité :
 * - Validation stricte des paramètres et payloads
 * - Filtrage des champs autorisés
 *
 * Effets de bord :
 * - Création, mise à jour et suppression de données persistées
 */

import {
    getAllCatwaysService,
    getCatwayByNumberService,
    findNextCatwayNumberService,
    checkCatwayNumberService,
    createCatwayService,
    updateCatwayService,
    checkBulkCatwaysBeforeDeleteService,
    deleteCatwaysBulkService,
    deleteCatwayService
} from "../services/catwayService.js";

import {
    validateCatwayCreate,
    validateCheckCatwayNumber
} from "../validators/catwayValidators.js";
import { validateCatwayNumber } from "../validators/params/idValidator.js";

import {
    formatCatway, 
    formatCatwaysList
} from "../utils/formatters/catwayFormatter.js";

import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";
import { ApiError } from "../utils/errors/apiError.js";

/**
 * GET ALL CATWAYS
 * =========================================================================================
 * Retourne la liste des catways.
 *
 * @async
 * @function getAllCatways
 * @route GET /api/catways
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

export const getAllCatways = async (req, res, next) => {
    try {
        // 1) Service
        const catways = await getAllCatwaysService();

        // 2) Réponse
        res.status(200).json({
            success: true,
            count: catways.length,
            data: formatCatwaysList(catways)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET CATWAY BY NUMBER
 * =========================================================================================
 * Retourne le détail d’un catway.
 *
 * @async
 * @function getCatwayByNumber
 * @route GET /api/catways/:id
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Numéro invalide
 * @throws {ApiError} 404 - Catway introuvable
 */

export const getCatwayByNumber = async (req, res, next) => {
    try {
        // 1) Validation ID
        const catwayNumber = validateCatwayNumber(req.params.id);
        
        // 2) Service
        const catway = await getCatwayByNumberService(catwayNumber);

        // 3) Réponse
        res.status(200).json({
            success: true,
            data: formatCatway(catway)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * GET NEXT CATWAY NUMBER
 * =========================================================================================
 * Retourne le prochain numéro de catway disponible.
 *
 * @async
 * @function getNextCatwayNumber
 * @route GET /api/catways/next-number
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

export const getNextCatwayNumber = async (req, res, next) => {
    try {
        // 1) Récupération du numéro de catway
        const nextNumber = await findNextCatwayNumberService();

        // 2) Réponse
        res.status(200).json({
            success: true,
            data: nextNumber
        });

    } catch (error) {
        next(error)
    }
}

/**
 * CHECK CATWAY NUMBER AVAILABILITY
 * =========================================================================================
 * Vérifie la disponibilité d’un numéro de catway.
 *
 * @async
 * @function checkCatwayNumber
 * @route GET /api/catways/check-number
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {catwayNumber} req.query.catwayNumber
 * @param {string} [req.query.excludeId]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

export const checkCatwayNumber = async (req, res, next) => {
  try {
    const { catwayNumber, excludeId } = req.query;

    // 1) Validation
    const errors = validateCheckCatwayNumber(req.query);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            message: "Donnée(s) invalide(s).",
            errors
        });
    }

    // 2) Service
    const available = await checkCatwayNumberService(
      catwayNumber,
      excludeId
    );

    // 3) Réponse
    res.status(200).json({
      success: true,
      data: {
        available
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * CREATE CATWAY
 * =========================================================================================
 * Crée un nouveau catway.
 *
 * @async
 * @function createCatway
 * @route POST /api/catways
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {number} req.body.catwayNumber
 * @param {string} req.body.catwayType
 * @param {string} req.body.catwayState
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 409 - Numéro déjà existant
 */

export const createCatway = async (req, res, next) => {
    try {
        // 1) Filtrage strict
        const allowedFields = [
            "catwayNumber",
            "catwayType",
            "catwayState"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        if (cleanData.catwayState) {
            cleanData.catwayState = cleanData.catwayState.trim();
        }
        
        // 2) Validation
        const errors = validateCatwayCreate(cleanData);
        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 3) Service
        const created = await createCatwayService(cleanData);

        // 4) Réponse
        res.status(201).json({
            success: true,
            message: "Catway créé avec succès.",
            data: formatCatway(created)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * UPDATE CATWAY
 * =========================================================================================
 * Met à jour un catway existant.
 *
 * @async
 * @function updateCatway
 * @route PUT /api/catways/:id
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {Object} req.body
 * @param {string} [req.body.catwayState]
 * @param {boolean} [req.body.isOutOfService]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 404 - Catway introuvable
 */

export const updateCatway = async (req, res, next) => {
    try {
        // 1) Validation ID
        const catwayNumber = validateCatwayNumber(req.params.id);

        // 2) Filtrage strict
        const allowedFields = [
            "catwayState",
            "isOutOfService"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        if (cleanData.catwayState) {
            cleanData.catwayState = cleanData.catwayState.trim();
        }

        if (Object.keys(cleanData).length === 0) {
            throw ApiError.badRequest(
                "Aucune donnée valide à mettre à jour."
            );
        }

        // 3) Service
        const updated = await updateCatwayService(
            catwayNumber,
            cleanData
        );

        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Catway mis à jour.",
            data: formatCatway(updated)
        });

    } catch (error) {
        next(error);
    }
};

/**
 * CHECK BULK CATWAYS BEFORE DELETE
 * =========================================================================================
 * Vérifie les contraintes avant suppression multiple.
 *
 * @async
 * @function checkCatwaysBeforeDelete
 * @route POST /api/catways/bulk-check
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Catway lié à des réservations
 */

export const checkCatwaysBeforeDelete = async (req, res, next) => {
    try {
        // 1) Validation
        const { ids } = req.body;

        await checkBulkCatwaysBeforeDeleteService(ids);

        // 2) Réponse
        res.status(200).json({
            success: true
        });

    } catch (error) {
        next(error);
    }
};

/**
 * DELETE CATWAYS BULK
 * =========================================================================================
 * Supprime plusieurs catways.
 *
 * @async
 * @function deleteCatwaysBulk
 * @route DELETE /api/catways/bulk
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
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */

export const deleteCatwaysBulk = async (req, res, next) => {
  try {

    // 1) Validation
    const { ids, password } = req.body;
    const userId = req.user.id;

    // 2) Service
    const result = await deleteCatwaysBulkService(ids, {
      userId,
      password
    });

    // 3) Réponse
    const count = result.count;
    const catwayLabel = count > 1 ? "catways" : "catway";
    const deletedLabel = count > 1 ? "supprimés" : "supprimé";
    
    res.status(200).json({
      success: true,
      message: `${count} ${catwayLabel} ${deletedLabel} avec succès.`,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE CATWAY
 * =========================================================================================
 * Supprime un catway.
 *
 * @async
 * @function deleteCatway
 * @route DELETE /api/catways/:id
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id
 * @param {Object} req.body
 * @param {string} [req.body.password]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Numéro invalide
 * @throws {ApiError} 401 - Mot de passe invalide
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */

export const deleteCatway = async (req, res, next) => {
    try{
        // 1) Validation ID
        const catwayNumber = validateCatwayNumber(req.params.id);

        // 2) Récupération du password éventuel et de l'utilisateur courant
        const { password } = req.body || {};
        const userId = req.user.id;

        // 3) Service
        const deleted = await deleteCatwayService(
            catwayNumber,
            {
                userId,
                password
            }
        );

        // 4) Réponse
        const responseData = {
            catway: formatCatway(deleted.catway)
        };

        if (deleted.reservationsDeleted) {
            responseData.reservationsDeleted = deleted.reservationsDeleted;
        }

        res.status(200).json({
            success: true,
            message: "Catway supprimé avec succès.",
            data: responseData
        });

    } catch (error) {
        next(error);
    }
};