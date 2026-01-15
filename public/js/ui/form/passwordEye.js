/**
 * ===================================================================
 * PASSWORD VISIBILITY TOGGLE
 * ===================================================================
 * - Permet d'afficher / masquer le mot de passe
 * - Met à jour l'icône (eye / eye-slash)
 * - Met à jour l'attribut aria-label pour l'accessibilité
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    const toggleBtn = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");

    if (!toggleBtn || !passwordInput) return;

    const icon = toggleBtn.querySelector("i");

    toggleBtn.setAttribute("aria-label", "Afficher le mot de passe");

    toggleBtn.addEventListener("click", () => {

        const isHidden = passwordInput.type === "password";

        // Toggle du type de champ
        passwordInput.type = isHidden ? "text" : "password";

        // Toggle des icônes
        icon.classList.toggle("fa-eye", !isHidden);
        icon.classList.toggle("fa-eye-slash", isHidden);

        // Accessibilité
        toggleBtn.setAttribute(
            "aria-label",
            isHidden
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
        );
    });
});