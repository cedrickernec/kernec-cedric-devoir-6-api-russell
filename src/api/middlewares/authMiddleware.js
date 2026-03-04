/**
 * AUTH - JWT AUTHENTICATION MIDDLEWARE
 * =========================================================================================
 * @module authMiddleware
 *
 * Middleware d’authentification basé sur JWT.
 *
 * Responsabilités :
 * - Vérifier la présence d’un token Bearer dans les headers
 * - Valider et décoder le token JWT
 * - Injecter l’utilisateur authentifié dans req.user
 *
 * Déclenché par :
 * - Routes protégées nécessitant une authentification
 *
 * Dépendances :
 * - jsonwebtoken
 * - ApiError
 *
 * Sécurité :
 * - Bloque l’accès si le token est absent, invalide ou expiré
 * - Ne divulgue pas d’informations sensibles
 *
 * Effets de bord :
 * - Ajoute la propriété req.user si authentification valide
 */

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";

/**
 * AUTH MIDDLEWARE
 * =========================================================================================
 * Vérifie la présence et la validité d’un token JWT.
 *
 * @function authMiddleware
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 *
 * @returns {void}
 *
 * @throws {ApiError} 401 - Token absent, invalide ou expiré
 */

export const authMiddleware = (req, res, next) => {
    try {
        // 1) Vérification header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw ApiError.unauthorized(
                "Accès refusé: aucun token fourni."
            );
        }

        // 2) Extraction du token
        const token = authHeader.split(" ")[1];

        if (!token) {
            throw ApiError.unauthorized(
                "Accès refusé: aucun token fourni."
            );
        }

        // 3) Vérification et décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 4) Attachement du user à req
        req.user = decoded;

        // 5) Validation
        next();

    } catch (error) {

        //Token expiré
        if (error.name ===  "TokenExpiredError") {
            return next(
                ApiError.unauthorized(
                    "Token expiré. Veuillez vous reconnecter."
                )
            );
        }

        // Token invalide
        if (error.name === "JsonWebTokenError") {
            return next(
                ApiError.unauthorized(
                    "Accès refusé: token invalide."
                )
            );
        }

        next(error);
    }
};