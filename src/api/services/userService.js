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
import { findUserByEmail } from "../repositories/userRepo.js";

import {
    getAllUsers,
    findUserById,
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

export async function getAllUsersService() {

    return getAllUsers();
}

// ===============================================
// GET USER BY ID
// ===============================================

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

export async function updateUserService(id, cleanData) {

    const user = await findUserById(id);

    if (!user) {
        throw ApiError.notFound(
            "Utilisateur introuvable.",
            { userId: id }
        );
    }

    const existing = await findUserByEmail(cleanData.email);

    if (existing && existing._id.toString() !== id) {
        throw ApiError.fieldConflict(
            "Impossible de mettre à jour l'utilisateur.",
            "email",
            "Un utilisateur avec cet email existe déjà."
        );
    }

    return updateUserById(id, cleanData);
}

// ===============================================
// UPDATE PASSWORD
// ===============================================

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