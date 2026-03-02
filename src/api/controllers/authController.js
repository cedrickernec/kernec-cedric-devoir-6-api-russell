/**
 * AUTH CONTROLLERS
 * =========================================================================================
 * @module authController
 *
 * Contrôleurs HTTP liés à l'authentification API.
 *
 * Responsabilités :
 * - Recevoir et valider les requêtes d'authentification
 * - Filtrer strictement les données entrantes
 * - Orchestrer les services métier d'auth
 * - Formater les réponses JSON standardisées
 *
 * Déclenché par :
 * - Routes /api/auth/*
 *
 * Dépendances :
 * - authService (logique métier)
 * - ApiError (gestion d'erreurs standardisée)
 * - jsonwebtoken (gestion JWT)
 *
 * Sécurité :
 * - Validation stricte des champs autorisés
 * - Vérification des tokens via secrets d'environnement
 *
 * Effets de bord :
 * - Génération de JWT (access / refresh)
 * - Retour de données utilisateur
 */

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";
import { loginService } from "../services/authService.js";
import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";

/**
 * LOGIN USER
 * =========================================================================================
 * Authentifie un utilisateur et génère des tokens JWT.
 *
 * @async
 * @function login
 *
 * @route POST /api/auth/login
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.email
 * @param {string} req.body.password
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 400 - Données manquantes
 * @throws {ApiError} 401 - Identifiants invalides
 */

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
            message: "Connexion réussie.",
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

/**
 * REFRESH ACCESS TOKEN
 * =========================================================================================
 * Génère un nouveau access token à partir d'un refresh token valide.
 *
 * @async
 * @function refreshToken
 *
 * @route POST /api/auth/refresh
 *
 * @param {Object} req
 * @param {Object} req.body
 * @param {string} req.body.refreshToken
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 *
 * @throws {ApiError} 401 - Token invalide ou expiré
 */

export const refreshToken = async (req, res, next) => {
    try {
      // 1) Filtrage strict
        const allowedFields = [
            "refreshToken"
        ];

        const cleanData = pickAllowedFields(req.body, allowedFields);

        // 2) Validation
        const { refreshToken } = cleanData;

        if (!refreshToken) {
            throw ApiError.badRequest("Refresh token requis.");
        }

        // 3) Vérification du refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // 4) Génération nouveau access token
        const newAccessToken = jwt.sign(
            { id: decoded.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_DURATION || "15m" }
        );

        // 5) Réponse
        res.status(200).json({
            success: true,
            message: "Token rafraîchi.",
            accessToken: newAccessToken
        });

    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }

        return next(
            ApiError.unauthorized("Refresh token invalide ou expiré.")
        );
    }
};

/**
 * LOGOUT USER
 * =========================================================================================
 * Termine la session côté client (stateless API).
 *
 * @async
 * @function logout
 *
 * @route POST /api/auth/logout
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {Promise<void>}
 */

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