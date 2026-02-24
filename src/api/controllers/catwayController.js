/**
 * ===================================================================
 * CATWAY CONTROLLERS
 * ===================================================================
 * - Reçoit les requêtes HTTP
 * - Filtre et valide les entrées utilisateur
 * - Appelle les services métier
 * - Formate les réponses API
 * ===================================================================
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

import { validateCatwayCreate } from "../validators/catwayValidators.js";
import { validateCatwayNumber } from "../validators/params/idValidator.js";

import {
    formatCatway, 
    formatCatwaysList
} from "../utils/formatters/catwayFormatter.js";

import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";
import { ApiError } from "../utils/errors/apiError.js";

// ===============================================
// GET ALL CATWAYS
// ===============================================
/**
 * @async
 * Récupère la liste complète des catways.
 *
 * @route GET /api/catways
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Liste des catways
 */
export const getAllCatways = async (req, res, next) => {
    try {
        // 1) Service
        const catways = await getAllCatwaysService();

        // 2) Réponse
        res.status(200).json({
            success: true,
            count: catways.length,
            message: catways.length === 0
              ? "Aucun catway trouvé."
              : undefined,
            data: formatCatwaysList(catways)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// GET CATWAY BY NUMBER
// ===============================================
/**
 * @async
 * Récupère un catway par son numéro.
 *
 * @route GET /api/catways/:id
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Détail du catway
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

// ===============================================
// GET NEXT CATWAY NUMBER
// ===============================================
/**
 * @async
 * Retourne le prochain numéro de catway disponible.
 *
 * @route GET /api/catways/next-number
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Numéro suggéré
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

// ===============================================
// CHECK CATWAY NUMBER AVAILABILITY
// ===============================================
/**
 * @async
 * Vérifie la disponibilité d'un numéro de catway.
 *
 * @route GET /api/catways/check-number
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.query
 * @param {number} req.query.number - Numéro à vérifier
 * @param {string} [req.query.excludeId] - ID à exclure lors d'une mise à jour
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Statut de disponibilité
 */
export const checkCatwayNumber = async (req, res, next) => {
  try {
    const { number, excludeId } = req.query;

    const available = await checkCatwayNumberService(
      number,
      excludeId
    );

    res.json({ available });

  } catch (error) {
    next(error);
  }
};

// ===============================================
// CREATE CATWAY
// ===============================================
/**
 * @async
 * Crée un nouveau catway.
 *
 * @route POST /api/catways
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {number} req.body.catwayNumber - Numéro du catway
 * @param {string} req.body.catwayType - Type du catway
 * @param {string} req.body.catwayState - État du catway
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 201 - Catway créé
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 409 - Numéro de catway existant
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

// ===============================================
// UPDATE CATWAY
// ===============================================
/**
 * @async
 * Met à jour un catway existant.
 *
 * @route PUT /api/catways/:id
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {Object} req.body
 * @param {string} [req.body.catwayState] - Nouvel état
 * @param {boolean} [req.body.isOutOfService] - Indique si hors service
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Catway mis à jour
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
            req.body,
            cleanData
        );

        // 4) Réponse
        res .status(200).json({
            success: true,
            message: "Catway mis à jour.",
            data: formatCatway(updated)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// CHECK BULK CATWAYS BEFORE DELETE
// ===============================================
/**
 * @async
 * Vérifie les contraintes avant suppression multiple de catways.
 *
 * @route POST /api/catways/bulk-check
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids - Liste des identifiants
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Validation réussie
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - La selection comporte un catway lié à des réservations
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

// ===============================================
// DELETE BULK CATWAYS
// ===============================================
/**
 * @async
 * Supprime plusieurs catways.
 *
 * @route DELETE /api/catways/bulk
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {Array<string>} req.body.ids - Liste des identifiants
 * @param {string} [req.body.password] - Mot de passe de confirmation
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Résultat de suppression
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 401 - Mot de passe invalide
 * @throws {ApiError} 404 - Catway introuvable
 * @throws {ApiError} 409 - Mot de passe requis
 */
export const deleteCatwaysBulk = async (req, res, next) => {
  try {

    const { ids, password } = req.body;
    const userId = req.user.id;

    const result = await deleteCatwaysBulkService(ids, {
      userId,
      password
    });

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    next(error);
  }
};

// ===============================================
// DELETE CATWAY
// ===============================================
/**
 * @async
 * Supprime un catway.
 *
 * @route DELETE /api/catways/:id
 * @group Catways
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {number} req.params.id - Numéro du catway
 * @param {Object} req.body
 * @param {string} [req.body.password] - Mot de passe de confirmation
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Object} 200 - Catway supprimé
 * @throws {ApiError} 400 - Numéro de catway invalide
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