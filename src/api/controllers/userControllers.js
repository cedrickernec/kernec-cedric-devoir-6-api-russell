/**
 * ===================================================================
 * USER CONTROLLERS
 * ===================================================================
 * - Fait le lien entre l'API et la logique métier :
 *      - Gère les requêtes HTTP
 *      - Valide les entrées via les validators
 *      - Appelle les services
 *      - Construit les réponses HTTP
 * ===================================================================
 */

import {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    updatePasswordService,
    deleteUserService
} from "../services/userService.js";

import { findUserByEmail } from "../repositories/userRepo.js";
import { validateUserCreate } from "../validators/userValidators.js";
import { validateObjectId } from "../validators/params/idValidator.js";

import {
    formatUser,
    formatUsersList
} from "../utils/formatters/userFormatter.js";

import { ApiError } from "../utils/errors/apiError.js";
import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";

// ===============================================
// GET ALL USERS
// ===============================================

export const getAllUsers = async (req, res, next) => {
    try {
        // 1) Service
        const users = await getAllUsersService();

        // 2) Réponse
        res.status(200).json({
            success: true,
            count: users.length,
            message: users.length === 0
              ? "Aucun utilisateur trouvé."
              : undefined,
            data: formatUsersList(users)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// GET USER BY ID
// ===============================================

export const getUserById = async (req, res, next) => {
    try {
        // 1) Validation ID
        const id = validateObjectId(
            req.params.id,
            "Identifiant utilisateur"
        );

        // 2) Service
        const user = await getUserByIdService(id);

        // 3) Réponse
        res.status(200).json({
            success: true,
            data: formatUser(user)
        });

    } catch (error) {
        next(error);
    }
}

// ===============================================
// CREATE USER
// ===============================================

export const createUser = async (req, res, next) => {
    try {
        // 1) Filtrage strict
        const allowedFields = [
            "username",
            "email",
            "password"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        const { username, email, password } = cleanData;

        // 2) Validation
        const errors = validateUserCreate(cleanData);

        const existing = await findUserByEmail(email);

        if (existing) {
            errors.email = "Un utilisateur avec cet email existe déjà.";
        }

        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 3) Service
        const created = await createUserService(cleanData);

        // 4) Réponse
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès.",
            data: formatUser(created)
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// UPDATE USER
// ===============================================

export const updateUser = async (req, res, next) => {
    try {
        // 1) Validation ID
        const id = validateObjectId(
            req.params.id,
            "Identifiant utilisateur"
        );

        // 2) Filtrage strict
        const allowedFields = ["username", "email"];
        const cleanData = pickAllowedFields(req.body, allowedFields);

        if (Object.keys(cleanData).length === 0) {
            throw ApiError.badRequest(
                "Aucune donnée valide à mettre à jour."
            );
        }

        // 3) Service
        const updated = await updateUserService(id, cleanData, req.body)

        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Utilisateur mis à jour.",
            data: formatUser(updated)
        });

    } catch (error) {
        next(error);
    }
}

// ===============================================
// UPDATE PASSWORD
// ===============================================

export const updatePassword = async (req, res, next) => {
    try {
        // 1) Validation ID
        const id = validateObjectId(
            req.params.id,
            "Identifiant utilisateur"
        );

        // 2) Filtrage strict
        const cleanData = pickAllowedFields(req.body, ["newPassword"]);

        if (!cleanData.newPassword) {
            throw ApiError.badRequest(
                "Le nouveau mot de passe est requis."
            );
        }

        // 3) Service
        await updatePasswordService(id, cleanData.newPassword);
        
        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Nouveau mot de passe enregistré."
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// DELETE USER
// ===============================================

export const deleteUser = async (req, res, next) => {
    try {
        // 1) Validation ID
        const id = validateObjectId(
            req.params.id,
            "Identifiant utilisateur"
        );

        // 2) Service
        const deleted = await deleteUserService(req.user.id, id);

        // 3) Réponse
        res.status(200).json({
            success: true,
            message: "Utilisateur supprimé avec succès.",
            data: formatUser(deleted)
        });

    } catch (error) {
        next(error);
    }
}