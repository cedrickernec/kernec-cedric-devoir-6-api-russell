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

export async function tryRefreshToken(req) {

    // Récupère le refreshToken à partir de la session
    const refreshToken = req.session?.user?.refreshToken;

    if (!refreshToken) return false;

    try {

        // Appel API
        const response = await fetch("http://localhost:3000/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        // Échec API → refresh impossible
        if (!response.ok) return false;

        const data = await response.json();

        // Mise à jour de la session
        // Remplacement du token expirée
        req.session.user.token = data.accessToken;

        return true;

    } catch (error) {
        console.error("Erreur refresh token :", error.message);
        return false;
    }
}