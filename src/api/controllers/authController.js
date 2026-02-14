/**
 * ===================================================================
 * AUTH CONTROLLERS
 * ===================================================================
 * - Fait le lien entre l'API et la logique métier :
 *      - Gère les requêtes HTTP
 *      - Appelle les services
 *      - Construit les réponses HTTP
 * ===================================================================
 */

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";
import { loginService } from "../services/authService.js";
import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";

// ===============================================
// LOGIN
// ===============================================

export const login = async (req, res, next) => {
    try {
      // 1) Filtrage strict
        const allowedFields = [
            "email",
            "password"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        // 2) Validation
        const { email, password } = cleanData;

        if (!email || !password) {
            throw ApiError.badRequest(
                "Email et mot de passe requis."
            );
        }

        // 3) Authentification
        const { accessToken, refreshToken, user } = await loginService(email, password);

        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Connexion réussi.",
            accessToken,
            refreshToken,
            data: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        next(error);
    }
};

// ===============================================
// REFRESH TOKEN
// ===============================================

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw ApiError.unauthorized("Refresh token manquant.");
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_DURATION || "30m" }
        );

        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        });

    } catch {
        next(ApiError.unauthorized("Session expirée."));
    }
};

// ===============================================
// LOGOUT
// ===============================================

export const logout = async (req, res, next) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Déconnecté avec succès."
        });

    } catch (error) {
        next(error);
    }
};