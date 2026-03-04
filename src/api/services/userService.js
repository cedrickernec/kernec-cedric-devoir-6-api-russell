/**
 * USER SERVICE
 * =========================================================================================
 * @module userService
 *
 * Porte la logique métier des utilisateurs.
 *
 * Fonctionnalités :
 * - Consultation (liste / détail)
 * - Création (unicité email + hash password)
 * - Mise à jour (unicité email)
 * - Mise à jour mot de passe (validation + non réutilisation)
 * - Suppression (règles métier : interdiction auto-suppression)
 *
 * Dépendances :
 * - userRepo (CRUD)
 * - bcrypt (hash / compare)
 * - userValidators (validatePassword)
 * - userRules (canDeleteUser)
 * - ApiError
 *
 * Sécurité :
 * - Hashage systématique des mots de passe
 * - Protection contre réutilisation de l’ancien mot de passe
 */

import bcrypt from "bcrypt";

import {
    getAllUsers,
    findUserById,
    findUserByEmail,
    createUser,
    updateUserById,
    deleteUserById,
    findUserByIdWithPassword
} from "../repositories/userRepo.js";

import {
    validatePassword
} from "../validators/userValidators.js";

import { canDeleteUser } from "./userRules.js";
import { ApiError } from "../utils/errors/apiError.js";

/**
 * GET ALL USERS
 * =========================================================================================
 * Retourne la liste des utilisateurs.
 *
 * @async
 * @function getAllUsersService
 *
 * @returns {Promise<Array<Object>>}
 */

export async function getAllUsersService() {

    return getAllUsers();
}

/**
 * GET USER BY ID
 * =========================================================================================
 * Retourne un utilisateur par identifiant.
 *
 * @async
 * @function getUserByIdService
 *
 * @param {string} id
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 404 Utilisateur introuvable
 */

export async function getUserByIdService(id) {

    const user = await findUserById(id);

    if (!user) {
        throw ApiError.notFound(
            "Utilisateur introuvable.",
            { userId: id }
        );
    }

    return user;
}

/**
 * CREATE USER
 * =========================================================================================
 * Crée un utilisateur (unicité email + hash password).
 *
 * @async
 * @function createUserService
 *
 * @param {Object} data
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 409 Email déjà utilisé
 */

export async function createUserService(data) {

    const existing = await findUserByEmail(data.email);

    if (existing) {
        throw ApiError.fieldConflict(
            "Impossible de créer l'utilisateur.",
            "email",
            "Un utilisateur avec cet email existe déjà."
        );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return createUser({
        username: data.username,
        email: data.email,
        password: hashedPassword
    });
}

/**
 * UPDATE USER
 * =========================================================================================
 * Met à jour un utilisateur (existence + unicité email si modifiée).
 *
 * @async
 * @function updateUserService
 *
 * @param {string} id
 * @param {Object} cleanData
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 404 Utilisateur introuvable
 * @throws {ApiError} 409 Email déjà utilisé
 */
export async function updateUserService(id, cleanData) {

    const user = await findUserById(id);

    if (!user) {
        throw ApiError.notFound(
            "Utilisateur introuvable.",
            { userId: id }
        );
    }
    
    if (cleanData.email) {
        const existing = await findUserByEmail(cleanData.email);

        if (existing && existing._id.toString() !== id) {
            throw ApiError.fieldConflict(
                "Impossible de mettre à jour l'utilisateur.",
                "email",
                "Un utilisateur avec cet email existe déjà."
            );
        }
    }

    return updateUserById(id, cleanData);
}

/**
 * UPDATE PASSWORD
 * =========================================================================================
 * Met à jour le mot de passe (validation + différent de l’ancien).
 *
 * @async
 * @function updatePasswordService
 *
 * @param {string} id
 * @param {string} newPassword
 *
 * @returns {Promise<boolean>}
 *
 * @throws {ApiError} 404 Utilisateur introuvable
 * @throws {ApiError} 400 Mot de passe invalide ou identique à l’ancien
 */

export async function updatePasswordService(id, newPassword) {

    const user = await findUserByIdWithPassword(id);

    if (!user) {
        throw ApiError.notFound(
            "Utilisateur introuvable.",
            { userId: id }
        );
    }

    const validation = validatePassword(newPassword);

    if (!validation.valid) {
        throw ApiError.validation(
            validation.errors,
            "Mot de passe invalide."
        );
    }

    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        throw ApiError.badRequest(
            "Le nouveau mot de passe doit être différent de l'ancien."
        );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
}

/**
 * DELETE USER
 * =========================================================================================
 * Supprime un utilisateur cible si les règles métier l’autorisent.
 *
 * @async
 * @function deleteUserService
 *
 * @param {string} currentUserId
 * @param {string} targetUserId
 *
 * @returns {Promise<Object>}
 *
 * @throws {ApiError} 404 Utilisateur introuvable
 * @throws {ApiError} 403 Suppression interdite (règle métier)
 */

export async function deleteUserService(currentUserId, targetUserId) {
    
    const user = await findUserById(targetUserId);

    if (!user) {
        throw ApiError.notFound(
            "Utilisateur introuvable.",
            { userId: targetUserId }
        );
    }

    if (!canDeleteUser(currentUserId, targetUserId)) {
        throw ApiError.forbidden(
            "Vous ne pouvez pas supprimer votre propre compte."
        );
    }

    return deleteUserById(targetUserId);
}