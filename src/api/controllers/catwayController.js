/**
 * ===================================================================
 * CATWAY CONTROLLERS
 * ===================================================================
 * - Fait le lien entre l'API et la logique métier :
 *      - Gère les requêtes HTTP
 *      - Valide les entrées via les validators
 *      - Appelle les services
 *      - Construit les réponses HTTP
 * ===================================================================
 */

import {
    createCatwayService,
    deleteCatwayService,
    getAllCatwaysService,
    getCatwayByNumberService,
    updateCatwayService
} from "../services/catwayService.js";

import {
    validateCatwayCreate,
    validateCatwayUpdate
} from "../validators/catwayValidators.js";

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

export const getCatwayByNumber = async (req, res, next) => {
    try {
        // 1) Validation ID
        const catwayNumber = validateCatwayNumber(req.params.id);
        
        // 2) Service
        const catway = await getCatwayByNumberService(catwayNumber);

        // 3) Réponse
        res.status(200).json({
            success: true,
            catway: formatCatway(catway)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// CREATE CATWAY
// ===============================================

export const createCatway = async (req, res, next) => {
    try {
        // 1) Filtrage strict
        const allowedFields = [
            "catwayNumber",
            "catwayType",
            "catwayState"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        // 2) Validation
        const errors = validateCatwayCreate(cleanData);
        if (Object.keys(errors).length > 0) {
            throw new ApiError(400, "Données invalides.", errors);
        }

        // 3) Service
        const created = await createCatwayService(cleanData);

        // 3) Réponse
        res.status(201).json({
            success: true,
            message: "Catway créé avec succès.",
            catway: formatCatway(created)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// UPDATE CATWAY
// ===============================================

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

        if (Object.keys(cleanData).length === 0) {
            throw new ApiError(400, "Aucune donnée valide à mettre à jour.")
        }

        // 3) Validation
        const errors = validateCatwayUpdate(cleanData);
        if (Object.keys(errors).length > 0) {
            throw new ApiError(400, "Données invalides.", errors);
        }

        // 4) Service
        const updated = await updateCatwayService(
            catwayNumber,
            req.body,
            cleanData
        );

        // 5) Réponse
        res .status(200).json({
            success: true,
            message: "Catway mis à jour.",
            catway: formatCatway(updated)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// DELETE CATWAY
// ===============================================

export const deleteCatway = async (req, res, next) => {
    try{
        // 1) Validation ID
        const catwayNumber = validateCatwayNumber(req.params.id);

        // 2) Service
        const deleted = await deleteCatwayService(catwayNumber);

        // 3) Réponse
        res.status(200).json({
            success: true,
            message: "Catway supprimé avec succès.",
            catway: formatCatway(deleted)
        });

    } catch (error) {
        next(error);
    }
};