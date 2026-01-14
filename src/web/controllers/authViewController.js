/**
 * --------------------------------------------------------------------
 * Authentification
 * --------------------------------------------------------------------
 * - Gestion de la connexion utilisateur
 * - Gestion de la déconnexion
 */

import User from "../../api/models/User.js";
import bcrypt from "bcrypt";

// ==================================================
// CONNEXION
// ==================================================

export const postLoginView = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // Identifiants invalides
    if (!user || !(await bcrypt.compare(password, user.password))) {
        req.session.authError = "Identifiants incorrects.";
        req.session.disableAnimations = true;
        return res.redirect("/");
    };

    // Session utilisateur
    req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email
    };

    res.redirect("/dashboard");
}

// ==================================================
// DÉCONNEXION
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