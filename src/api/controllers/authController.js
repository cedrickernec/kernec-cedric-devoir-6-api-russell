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

import { ApiError } from "../utils/errors/apiError.js";
import { loginService } from "../services/authService.js";
import { pickAllowedFields } from "../utils/errors/pickAllowedFields.js";

// ===============================================
// CONNEXION
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
        const { email, password } = req.body;

        if (!email || !password) {
            throw ApiError.badRequest(
                "Email et mot de passe requis."
            );
        }

        // 3) Authentification
        const { token, user} = await loginService(email, password);

        // 4) Réponse
        res.status(200).json({
            success: true,
            message: "Connexion réussi.",
            token,
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
// DÉCONNEXION
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