/**
 * ===================================================================
 * AUTH - REFRESH TOKEN HANDLER
 * ===================================================================
 * - Tente de renouveler automatiquement le JWT utilisateur
 * - Utilise le refreshToken stocké en session
 * - Met à jour le accessToken en cas de succès
 * ===================================================================
 * Utilisé pour maintenir une session active côté WEB
 * sans forcer une reconnexion utilisateur.
 * ===================================================================
 */

import { apiFetch } from "../../gateways/api/apiFetch.js";

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