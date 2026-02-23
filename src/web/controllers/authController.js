/**
 * ===================================================================
 * AUTH VIEW CONTROLLER
 * ===================================================================
 * - Gestion de la connexion / deconnexion utilisateur
 * - Délègue l'authentification à l'API
 * - Stock le JWT en session serveur
 * ===================================================================
 */

import { apiFetch } from "../gateways/api/apiFetch.js";

// ==================================================
// HELPERS
// ==================================================

// Sécurise les redirection
function getSafeRedirect(value, fallback = "/dashboard") {
    if (typeof value !== "string") return fallback;

    const trimmed = value.trim();

    // Autorise uniquement les routes internes
    if(!trimmed.startsWith("/")) return fallback;
    if(trimmed.startsWith("//")) return fallback;

    return trimmed;
}

// ==================================================
// LOGIN
// ==================================================

export const postLogin = async (req, res) => {

    const { email, password } = req.body;

    try {
        // Appel API
        const apiResponse = await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        }, req);

        const apiData = apiResponse.data;

        // Erreur d'authentification
        if (!apiResponse.success || !apiData?.accessToken) {
            req.session.authError = "Identifiants incorrects.";
            req.session.disableAnimations = true;
            
            return res.redirect("/");
        }

        // Session utilisateur
        req.session.user = {
            id: apiData.data.id,
            username: apiData.data.username,
            email: apiData.data.email,
            token: apiData.accessToken,
            refreshToken: apiData.refreshToken
        };

        // Flag utilisé côté UI
        req.session.justLoggedIn = true;

        // Redirect sécurisé
        const redirectTo = getSafeRedirect(req.body.redirect || "/dashboard");

        return res.redirect(redirectTo);

    } catch (error) {
        console.error("Erreur login:", error);
        req.session.authError = "Identifiants incorrects.";
        req.session.disableAnimations = true;
        res.redirect("/");
    }
}

// ==================================================
// LOGOUT
// ==================================================

export const getLogout = async (req, res) => {

    const referer = req.headers.referer;
    let redirectAfterLogout = "/dashboard";

    // Détermination page retour sécurisée
    if (referer) {
        try {
            const url = new URL(referer);
            redirectAfterLogout = getSafeRedirect(url.pathname, "/dashboard");

        } catch {
            redirectAfterLogout = "/dashboard";
        }
    }

    // Appel API
    try {
        await apiFetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        }, req, res);

    } catch (error) {
        console.warn("Erreur logout :", error.message);
    }
    
    // Session destruction
    req.session.destroy(err => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
            return res.redirect("/dashboard");
        }

        res.clearCookie("russell.sid");
        return res.redirect(`/?redirect=${encodeURIComponent(redirectAfterLogout)}`);
    });
};