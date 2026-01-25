/**
 * ===================================================================
 * API CLIENT
 * ===================================================================
 * - Couche d'abstraction des appels HTTP vers l'API
 * - Injecte automatiquement le token JWT
 * - Déconnecte l'utilisateur
 * - Centralise la gestion des réponses HTTP
 * ===================================================================
 */

export async function apiFetch(url, options = {}, req, res) {

    const token = req.session?.user?.token;

    if (!token) {
        return { authExpired: true };
    }

    const response = await fetch(`http://localhost:3000${url}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...(options.header || {})
        }
    });

    if (response.status === 401) {
        req.session.destroy(() => {
            res.redirect("/login");
        });
        return { authExpired: true };
    }

    if (!response.ok) {
        return { error: true };
    }

    return response.json();
}