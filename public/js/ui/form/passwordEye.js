/**
 * PASSWORD VISIBILITY TOGGLE
 * =========================================================================================
 * @module passwordEye
 * 
 * Gère l'affichage / masquage du mot de passe utilisateur.
 *
 * Fonctionnalités :
 * - Alterne le type du champ (password / text)
 * - Synchronise l'icône visuelle (eye / eye-slash)
 * - Met à jour les attributs ARIA pour l'accessibilité
 */

document.addEventListener("DOMContentLoaded", () => {

    const toggleBtn = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");

    if (!toggleBtn || !passwordInput) return;

    const icon = toggleBtn.querySelector("i");

    // État initial accessibilité
    toggleBtn.setAttribute("aria-label", "Afficher le mot de passe");

    // =====================================================
    // TOGGLE HANDLER
    // =====================================================

    toggleBtn.addEventListener("click", () => {

        const isHidden = passwordInput.type === "password";

        // Toggle visibilité champ
        passwordInput.type = isHidden ? "text" : "password";

        // Synchronisation icônes
        icon.classList.toggle("fa-eye", !isHidden);
        icon.classList.toggle("fa-eye-slash", isHidden);

        // Mise à jour accessibilité
        toggleBtn.setAttribute(
            "aria-label",
            isHidden
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
        );
    });
});