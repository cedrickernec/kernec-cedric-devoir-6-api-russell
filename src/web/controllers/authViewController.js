/**
 * ===================================================================
 * AUTH VIEW CONTROLLER
 * ===================================================================
 * - Gestion de la connexion/deconnexion utilisateur
 *      - Délègue l'authentification à l'API
 *      - Stock le JWT en session
 * ===================================================================
 */

// ==================================================
// LOGIN
// ==================================================

export const postLoginView = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Appel API
        const apiResponse = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const apiData = await apiResponse.json();

        // Erreur d'authentification
        if (!apiResponse.ok || !apiData.data || !apiData.accessToken) {
            req.session.authError = "Identifiants incorrects.";
            req.session.disableAnimations = true;
            
            return res.redirect("/");
        }

        console.log("API LOGIN RESPONSE:", apiData);

        // Session utilisateur
        req.session.user = {
            id: apiData.data.id,
            username: apiData.data.username,
            email: apiData.data.email,
            token: apiData.accessToken,
            refreshToken: apiData.refreshToken
        };

        res.redirect("/dashboard");

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

export const getLogoutView = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
            return res.redirect("/dashboard");
        }

        res.clearCookie("russell.sid");
        res.redirect("/");
    });
};