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
// HELPERS
// ==================================================

function getSafeRedirect(value, fallback = "/dashboard") {
    if (typeof value !== "string") return fallback;

    const trimmed = value.trim();

    if(!trimmed.startsWith("/")) return fallback;
    if(trimmed.startsWith("//")) return fallback;

    return trimmed;
}

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
        if (!apiResponse.ok || !apiData?.data || !apiData?.accessToken) {
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

export const getLogoutView = async (req, res) => {

    const referer = req.headers.referer;
    let redirectAfterLogout = "/dashboard";

    if (referer) {
        try {
            const url = new URL(referer);
            redirectAfterLogout = getSafeRedirect(url.pathname, "/dashboard");

        } catch {
            redirectAfterLogout = "/dashboard";
        }
    }

    try {
        await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.warn("Erreur logout :", error.message);
    }
    
    req.session.destroy(err => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
            return res.redirect("/dashboard");
        }

        res.clearCookie("russell.sid");
        return res.redirect(`/?redirect=${encodeURIComponent(redirectAfterLogout)}`);
    });
};