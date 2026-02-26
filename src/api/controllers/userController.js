/**
 * USER CONTROLLERS
 * =========================================================================================
 * @module userController
 *
 * Contrôleurs HTTP liés à la gestion des utilisateurs.
 *
 * Responsabilités :
 * - Valider les identifiants utilisateur
 * - Filtrer strictement les données entrantes
 * - Orchestrer les services métier utilisateur
 * - Normaliser les réponses JSON API
 *
 * Déclenché par :
 * - Routes /api/users/*
 *
 * Dépendances :
 * - userService
 * - userValidators
 * - userFormatter
 * - ApiError
 *
 * Sécurité :
 * - Validation stricte des ObjectId
 * - Filtrage des champs autorisés
 * - Protection contre auto-suppression interdite
 *
 * Effets de bord :
 * - Création, modification et suppression persistante d’utilisateurs
 */

import {
    getAllUsersService,
    getUserByIdService,
    createUserService,
    updateUserService,
    updatePasswordService,
    deleteUserService
} from "../services/userService.js";

import { validateUserCreate, validateUserUpdate } from "../validators/userValidators.js";
import { validateObjectId } from "../validators/params/idValidator.js";

import {
    formatUser,
    formatUsersList
} from "../utils/formatters/userFormatter.js";

import { ApiError } from "../utils/errors/apiError.js";
import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";

/**
 * GET ALL USERS
 * =========================================================================================
 * Retourne la liste complète des utilisateurs.
 *
 * @async
 * @function getAllUsers
 * @route GET /api/users
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

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

/**
 * GET USER BY ID
 * =========================================================================================
 * Retourne le détail d’un utilisateur.
 *
 * @async
 * @function getUserById
 * @route GET /api/users/:id
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {string} req.params.id
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 404 - Utilisateur introuvable
 */

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

/**
 * CREATE USER
 * =========================================================================================
 * Crée un nouvel utilisateur.
 *
 * @async
 * @function createUser
 * @route POST /api/users
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.username
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 409 - Email déjà utilisé
 */

export const createUser = async (req, res, next) => {
    try {
        // 1) Filtrage strict
        const allowedFields = [
            "username",
            "email",
            "password"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        // 2) Validation
        const errors = validateUserCreate(cleanData);

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

/**
 * UPDATE USER
 * =========================================================================================
 * Met à jour les informations d’un utilisateur.
 *
 * @async
 * @function updateUser
 * @route PUT /api/users/:id
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {string} req.params.id
 * @param {Object} req.body
 * @param {string} [req.body.username]
 * @param {string} [req.body.email]
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données invalides
 * @throws {ApiError} 404 - Utilisateur introuvable
 * @throws {ApiError} 409 - Email déjà utilisé
 */

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

        // 3) Validation
        const errors = validateUserUpdate(cleanData);

        if (Object.keys(errors).length > 0) {
            throw ApiError.validation(
                errors
            );
        }

        // 4) Service
        const updated = await updateUserService(id, cleanData)

        // 5) Réponse
        res.status(200).json({
            success: true,
            message: "Utilisateur mis à jour.",
            data: formatUser(updated)
        });

    } catch (error) {
        next(error);
    }
}

/**
 * UPDATE PASSWORD
 * =========================================================================================
 * Met à jour le mot de passe d’un utilisateur.
 *
 * @async
 * @function updatePassword
 * @route PUT /api/users/:id/password
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {string} req.params.id
 * @param {Object} req.body
 * @param {string} req.body.newPassword
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Mot de passe invalide
 * @throws {ApiError} 404 - Utilisateur introuvable
 */

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

/**
 * DELETE USER
 * =========================================================================================
 * Supprime un utilisateur.
 *
 * @async
 * @function deleteUser
 * @route DELETE /api/users/:id
 *
 * @param {Object} req
 * @param {Object} req.params
 * @param {string} req.params.id
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Identifiant invalide
 * @throws {ApiError} 403 - Suppression interdite
 * @throws {ApiError} 404 - Utilisateur introuvable
 */

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