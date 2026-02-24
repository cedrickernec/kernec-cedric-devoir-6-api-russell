/**
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 * - Décide si une action métier est autorisée :
 *      - Contient la logique métier de l'application
 *      - Applique les règles fonctionnelles
 *      - Appelle les validators, les rules et les repositories
 * ============================================================
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";

import {
    findUserByEmailWithPassword
} from "../repositories/userRepo.js";

// ===============================================
// LOGIN
// ===============================================
/**
 * @async
 * Authentifie un utilisateur et génère les tokens d'accès.
 * 
 * @function loginService
 * 
 * @param {string} email - Email utilisateur
 * @param {string} password - Mot de passe en clair
 * 
 * @returns {Promise<{
 *      accessToken: string,
 *      refreshToken: string,
 *      user: Object
 * }>} - Retourne les tokens (access/refresh) et l'utilisateur (password à ne jamais renvoyer en clair côté controller).
 * @throws {ApiError} 401 - Email ou mot de passe incorrect.
 * 
 * @requires process.env.JWT_SECRET
 * @requires process.env.JWT_REFRESH_SECRET
 * @requires process.env.ACCESS_TOKEN_DURATION
 * @requires process.env.REFRESH_TOKEN_DURATION
 */
export async function loginService(email, password) {

    const user = await findUserByEmailWithPassword(email);

    if (!user) {
        throw ApiError.unauthorized(
            "Email ou mot de passe incorrect."
        );
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw ApiError.unauthorized(
            "Email ou mot de passe incorrect."
        );
    }

    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_DURATION || "30m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_DURATION || "7d" }
    )

    return { accessToken, refreshToken, user };
}