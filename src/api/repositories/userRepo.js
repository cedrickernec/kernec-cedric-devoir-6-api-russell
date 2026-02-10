/**
 * ===================================================================
 * USER REPOSITORY
 * ===================================================================
 * - Lit et écrit les données uniquement :
 *      - Centralise tous les accès à la base de données
 * ===================================================================
 */

import User from "../models/User.js";

// ===============================================
// GET ALL USERS
// ===============================================

export async function getAllUsers() {

    return User.find()
    .collation({ locale: "fr", strength: 2 })
    .sort({ username: 1 })
    .select("-password");
}

// ===============================================
// FIND USER BY ID
// ===============================================

export async function findUserById(id) {

    return User.findById(id).select("-password");
}

// ===============================================
// FIND USER BY ID (WITH PASSWORD)
// - For updatePassword
// ===============================================

export async function findUserByIdWithPassword(id) {

    return User.findById(id);
}

// ===============================================
// FIND USER BY EMAIL
// ===============================================

export async function findUserByEmail(email) {

    return User.findOne({ email }).select("-password");
}

// ===============================================
// FIND USER BY EMAIL (WITH PASSWORD)
// - For login
// ===============================================

export async function findUserByEmailWithPassword(email) {

    return User.findOne({ email });
}

// ===============================================
// CREATE USER
// ===============================================

export async function createUser(data) {

    return User.create(data);
}

// ===============================================
// UPDATE USER
// ===============================================

export async function updateUserById(id, data) {

    return User.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    ).select("-password");
}

// ===============================================
// DELETE USER
// ===============================================

export async function deleteUserById(id) {

    return User.findByIdAndDelete(id).select("-password");
}
