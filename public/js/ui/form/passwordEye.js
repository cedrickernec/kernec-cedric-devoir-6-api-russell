/**
 * ===================================================================
 * PASSWORD VISIBILITY TOGGLE
 * ===================================================================
 * - Affiche / Masque le mot de passe utilisateur
 * - Synchronise l'icône visuelle (eye / eye-slash)
 * - Met à jour l'attribut ARIA pour l'accessibilité
 * ===================================================================
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