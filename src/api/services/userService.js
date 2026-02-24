/**
 * ============================================================
 * USER SERVICE
 * ============================================================
 * - Décide si une action métier est autorisée :
 *      - Contient la logique métier de l'application
 *      - Applique les règles fonctionnelles
 *      - Appelle les validators, les rules et les repositories
 * ============================================================
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

// ===============================================
// GET ALL USERS
// ===============================================
/**
 * @async
 * Récupère tous les utilisateurs par son identifiant.
 * 
 * @function getAllUsersService
 * 
 * @returns {Promise<Array<Object>>} - Liste des utilisateurs (formatage côté controller/formatter)
 */
export async function getAllUsersService() {

    return getAllUsers();
}

// ===============================================
// GET USER BY ID
// ===============================================
/**
 * @async
 * Récupère un utilisateur par son identifiant.
 * 
 * @function getUserByIdService
 * 
 * @param {string} id - ObjectId de l'utilisateur
 * 
 * @returns {Promise<Object>} - Utilisateur trouvé
 * @throws {ApiError} 404 - Utilisateur introuvable
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

// ===============================================
// CREATE USER
// ===============================================
/**
 * @async
 * Crée un utilisateur après contrôle d'unicité email et hash du mot de passe.
 * 
 * @function createUserService
 * 
 * @param {Object} data - Donnée de création
 * @param {string} data.username - Nom d'utilisateur
 * @param {string} data.email - Email utilisateur (doit être unique)
 * @param {string} data.password - Mot de passe en clair (sera hashé)
 * 
 * @returns {Promise<Object>} - Utilisateur créé
 * @throws {ApiError} 409 - Conflit d'unicité (email déjà utilisé)
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

// ===============================================
// UPDATE USER
// ===============================================
/**
 * @async
 * Met à jour un utilisateur après contrôle d'existence et unicité email.
 * 
 * @function updateUserService
 * 
 * @param {string} id - ObjectId de l'utilisateur à modifier
 * @param {Object} cleanData - Champs autorisés/filtrés côté controller
 * @param {string} [cleanData.username] - Nouvel username
 * @param {string} [cleanData.email] - Nouvel email (doit rester unique)
 * 
 * @returns {Promise<Object>} - Utilisateur mis à jour
 * @throws {ApiError} 404 - Utilisateur introuvable
 * @throws {ApiError} 409 - Conflit d'unicité (email déjà utilisé)
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

// ===============================================
// UPDATE PASSWORD
// ===============================================
/**
 * @async
 * Met à jour le mot de passe d'un utilisateur (validation + interdiction de réutiliser l'ancien).
 * 
 * @function updatePasswordService
 * 
 * @param {string} id - OvjectId de l'utilisateur
 * @param {string} newPassword - Nouveau mot de passe en clair
 * 
 * @returns {Promise<boolean>} - True si la mise à jour a été effectuée
 * @throws {ApiError} 404 - Utilisateur introuvable
 * @throws {ApiError} 400 - Mot de passe invalide (règles de validation)
 * @throws {ApiError} 400 - Nouveau mot de passe identique à l'ancien
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

// ===============================================
// DELETE USER
// ===============================================
/**
 * @async
 * Supprime un utilisateur cible si les règles métier l'autorisent.
 * 
 * @function deleteUserService
 * 
 * @param {string} currentUserId - ObjectId de l'utilisateur connecté (demandeur)
 * @param {string} targetUserId - ObjectId de l'utilisateur à supprimer (cible)
 * 
 * @returns {Promise<Object>} - Utilisateur supprimé
 * @throws {ApiError} 404 - Utilisateur introuvable
 * @throws {ApiError} 403 - Suppression interdite (ex: auto-suppression)
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