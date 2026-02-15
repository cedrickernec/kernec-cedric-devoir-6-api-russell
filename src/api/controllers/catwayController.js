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
    createCatwayService,
    deleteCatwayService,
    getAllCatwaysService,
    getCatwayByNumberService,
    updateCatwayService
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
            data: formatCatway(catway)
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
// DELETE CATWAY
// ===============================================

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