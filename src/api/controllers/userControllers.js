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

import {
    validateUserUpdate,
    validatePassword,
    validateUserCreate
} from "../validators/userValidators.js";

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
            users: formatUsersList(users)
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
            user: formatUser(user)
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
        if (Object.keys(errors).length > 0) {
            throw new ApiError(400, "Données invalides.", errors);
        }

        // 3) Service
        const created = await createUserService(cleanData);

        // 4) Réponse
        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès.",
            user: formatUser(created)
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
            throw new ApiError(400, "Aucune donnée valide à mettre à jour.")
        }

        // 3) Validations
        const errors = validateUserUpdate(cleanData);
        if (Object.keys(errors).length > 0) {
            throw new ApiError(400, "Données invalides.", errors);
        }

        // 4) Service
        const updated = await updateUserService(id, cleanData, req.body)

        // 5) Réponse
        res.status(200).json({
            success: true,
            message: "Utilisateur mis à jour.",
            user: formatUser(updated)
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
            throw new ApiError(400, "Le nouveau mot de passe est requis.");
        }

        // 3) Validation
        const validation = validatePassword(cleanData.newPassword);
        if (!validation.valid) {
            throw new ApiError(400, "Mot de passe invalide.", validation.errors);
        }

        // 4) Recupération
        await updatePasswordService(id, cleanData.newPassword);

        // 5) Réponse
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
            user: formatUser(deleted)
        });

    } catch (error) {
        next(error);
    }
}