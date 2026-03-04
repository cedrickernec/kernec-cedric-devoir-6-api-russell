/**
 * AUTH SERVICE
 * =========================================================================================
 * @module authService
 *
 * Porte la logique métier d’authentification.
 *
 * Fonctionnalités :
 * - Validation des identifiants (email/mot de passe)
 * - Génération de tokens JWT (access / refresh)
 *
 * Dépendances :
 * - bcrypt (comparaison mot de passe)
 * - jsonwebtoken (signature JWT)
 * - userRepo (findUserByEmailWithPassword)
 * - ApiError (normalisation des erreurs métier)
 *
 * Sécurité :
 * - Secrets JWT via variables d’environnement
 * - Ne renvoie jamais le mot de passe en clair (c’est au controller de filtrer la réponse)
 *
 * Effets de bord :
 * - Aucun accès direct HTTP ; uniquement génération de tokens et lecture DB via repository
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";

import {
    findUserByEmailWithPassword
} from "../repositories/userRepo.js";

/**
 * LOGIN
 * =========================================================================================
 * Authentifie un utilisateur et génère les tokens d’accès.
 *
 * @async
 * @function loginService
 *
 * @param {string} email Email utilisateur
 * @param {string} password Mot de passe en clair
 *
 * @returns {Promise<{accessToken: string, refreshToken: string, user: Object}>}
 *
 * @throws {ApiError} 401 Identifiants invalides
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