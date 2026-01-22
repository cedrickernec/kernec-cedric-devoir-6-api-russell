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
    canDeleteUser
} from "./userRules.js";

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
        throw new ApiError(404, "Utilisateur introuvable.");
    }

    return user;
}

// ===============================================
// CREATE USER
// ===============================================

export async function createUserService(data) {

    const existing = await findUserByEmail(data.email);

    if (existing) {
        throw new ApiError(409, "Un utilisateur avec cet email existe déjà.");
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

export async function updateUserService(id, cleanData, rawBody) {

    const user = await findUserById(id);

    if (!user) {
        throw new ApiError(404, "Utilisateur introuvable.")
    }

    if (cleanData.email) {
        const existing = await findUserByEmail(cleanData.email);

        if (existing && existing._id.toString() !== id) {
            throw new ApiError(409, "Un utilisateur avec cet email existe déjà.");
        }
    }

    return updateUserById(id, cleanData);
}

// ===============================================
// UPDATE PASSWORD
// ===============================================

export async function updatePasswordService(id, newPassword) {

    const user = await findUserByIdWithPassword(id);

    if (!user) {
        throw new ApiError(404, "Utilisateur introuvable.")
    }

    const isSamePassword = await bcrypt.compare(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        throw new ApiError(400, "Le nouveau mot de passe doit être différent de l'ancien.");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return true;
}

// ===============================================
// DELETE USER
// ===============================================

export async function deleteUserService(currentUserId, targetUserId) {

    if (!canDeleteUser(currentUserId, targetUserId)) {
        throw new ApiError(403, "Vous ne pouvez pas supprimer votre propre compte.");
    }

    const user = await findUserById(targetUserId);

    if (!user) {
        throw new ApiError(404, "Utilisateur introuvable.")
    }

    return deleteUserById(targetUserId);
}