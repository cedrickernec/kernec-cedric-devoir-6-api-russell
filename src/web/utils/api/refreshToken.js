/**
 * WEB REFRESH TOKEN HANDLER
 * =========================================================================================
 * @module refreshToken
 *
 * Gestion automatique du renouvellement JWT côté Web.
 *
 * Responsabilités :
 * - Lire le refreshToken stocké en session
 * - Appeler l’API /api/auth/refresh
 * - Mettre à jour l’accessToken en session
 *
 * Dépendances :
 * - apiFetch
 *
 * Effets de bord :
 * - Met à jour req.session.user.token
 */

import { apiFetch } from "../../gateways/api/apiFetch.js";

/**
 * TRY REFRESH TOKEN
 * =========================================================================================
 * Tente de renouveler le JWT utilisateur via le refreshToken.
 *
 * @function tryRefreshToken
 * @async
 *
 * @param {Object} req
 *
 * @returns {Promise<boolean>}
 * - true  → token renouvelé
 * - false → échec du refresh
 */

export async function tryRefreshToken(req) {

    // Récupère le refreshToken à partir de la session
    const refreshToken = req.session?.user?.refreshToken;

    if (!refreshToken) return false;

    try {

        // Appel API
        const response = await apiFetch("/api/auth/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken })
        }, req);

        // Échec API → refresh impossible
        if (!response.success || !response.data?.accessToken) {
            return false;
        }

        // Mise à jour de la session
        // Remplacement du token expirée
        req.session.user.token = response.data.accessToken;

        return true;

    } catch (error) {
        console.error("Erreur refresh token :", error.message);
        return false;
    }
}