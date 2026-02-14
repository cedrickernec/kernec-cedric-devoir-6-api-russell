/**
 * ===================================================================
 * API FETCH
 * ===================================================================
 * - Couche d'abstraction des appels HTTP vers l'API
 * - Injecte automatiquement le token JWT
 * - Centralise la gestion des réponses HTTP
 * - Garantit un format de retour uniforme
 * ===================================================================
 */

import { tryRefreshToken } from "../../utils/refreshToken.js";

export async function apiFetch(url, options = {}, req, res) {

    // ==================================================
    // TOKEN
    // ==================================================

    const token = req.session?.user?.token;

    if (!token) {
        return {
            success: false,
            authExpired: true
        };
    }

    // ==================================================
    // FETCH
    // ==================================================

    let response;

    try {
        response = await fetch(`http://localhost:3000${url}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(options.headers || {})
            }
        });

    } catch (error) {
        return {
            success: false,
            message: "Erreur de connexion à l'API.",
            context: error.message
        };
    }

    // ==================================================
    // JWT expiré → tentative refresh
    // ==================================================

    if (response.status === 401) {

        const refreshed = await tryRefreshToken(req);

        if (refreshed) {
            return apiFetch(url, options, req, res);
        }

        return {
            success: false,
            authExpired: true
        };
    }

    // ==================================================
    // PARSE RÉPONSE
    // ==================================================

    let data = null;

    try {
        data = await response.json();
    } catch {
        /* */
    }

    // ==================================================
    // ERREUR API
    // ==================================================

    if (!response.ok) {
        return {
            success: false,
            message: data?.message || null,
            errors: data?.errors || {},
            context: data?.context || null
        };
    }

    // ==================================================
    // SUCCÈS
    // ==================================================

    return {
        success: true,
        message: data?.message || null,
        data: data?.data ?? data
    };
}