/**
 * ===================================================================
 * API CLIENT
 * ===================================================================
 * - Couche d'abstraction des appels HTTP vers l'API
 * - Injecte automatiquement le token JWT
 * - Déconnecte l'utilisateur si JWT expiré
 * - Centralise la gestion des réponses HTTP
 * - Garantit un format de retour uniforme
 * ===================================================================
 */

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

    const response = await fetch(`http://localhost:3000${url}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(options.headers || {})
        }
    });

    // ==================================================
    // JWT expiré
    // ==================================================

    if (response.status === 401) {
        req.session.destroy(() => {
            res.redirect("/login");
        });

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
    } catch {}

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