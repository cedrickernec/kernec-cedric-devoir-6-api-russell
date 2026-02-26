/**
 * API FETCH
 * =========================================================================================
 * @module apiFetch
 *
 * Couche d’abstraction des appels HTTP vers l’API backend.
 *
 * Responsabilités :
 * - Injecter automatiquement le JWT en header Authorization
 * - Tenter un refresh automatique en cas de 401
 * - Normaliser toutes les réponses dans un format uniforme
 * - Gérer la détection d’expiration de session
 *
 * Dépendances :
 * - tryRefreshToken
 * - Session Express
 * - API backend interne
 *
 * Sécurité :
 * - Ne transmet le token que si requis
 * - Ne retourne jamais directement la réponse brute fetch
 *
 * Effets de bord :
 * - Peut déclencher un refreshToken
 * - Peut signaler authExpired au contrôleur
 */

/**
 * @typedef {Object} ApiFetchResult
 *
 * @property {boolean} success
 * @property {string|null} [message]
 * @property {*} [data]
 * @property {Object} [errors]
 * @property {Object|null} [context]
 * @property {number} [status]
 * @property {boolean} [authExpired]
 */

import { tryRefreshToken } from "../../utils/api/refreshToken.js";

/**
 * API FETCH FUNCTION
 * =========================================================================================
 * Effectue un appel HTTP vers l’API backend.
 *
 * @async
 * @function apiFetch
 *
 * @param {string} url - Endpoint API à appeler
 * @param {Object} [options={}] - Options fetch (method, headers, body…)
 *
 * @param {Object} req - Requête Express
 * @param {Object} req.session
 * @param {Object} [req.session.user]
 * @param {string} [req.session.user.token]
 *
 * @returns {Promise<ApiFetchResult>}
 */

export async function apiFetch(url, options = {}, req) {

    const publicRoutes = ["/api/auth/login", "/api/auth/refresh"];
    const isAuthRoute = url.startsWith("/api/auth/");
    const isPublic = publicRoutes.includes(url);
    const token = req.session?.user?.token;

    // ==================================================
    // TOKEN
    // ==================================================

    if (!token && !isPublic) {
        return {
            success: false,
            authExpired: true,
            message: "Non authentifié."
        };
    }

    // ==================================================
    // FETCH
    // ==================================================

    const baseUrl = process.env.NODE_ENV === "production"
    ? `${req.protocol}://${req.get("host")}`
    : `http://localhost:3000`;
    
    let response;

    try {
        response = await fetch(`${baseUrl}${url}`, {
            ...options,
            headers: {
                ...(options.headers || {}),
                ...(token && !isPublic ? { Authorization: `Bearer ${token}` } : {}),
                "Content-Type": "application/json",
                Accept: "application/json"
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

    if (response.status === 401 && !isPublic && !isAuthRoute) {

        const refreshed = await tryRefreshToken(req);

        if (refreshed) {
            return apiFetch(url, options, req);
        }

        return {
            success: false,
            authExpired: true,
            message: "Session expirée."
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
            message: data?.message || "Erreur API",
            errors: data?.errors || {},
            context: data?.context || null,
            status: response.status
        };
    }

    // ==================================================
    // SUCCÈS
    // ==================================================

    
    const payload = isAuthRoute ? data : (data?.data ?? data);

    return {
        success: true,
        message: data?.message || null,
        data: payload,
        status: response.status
    };
}