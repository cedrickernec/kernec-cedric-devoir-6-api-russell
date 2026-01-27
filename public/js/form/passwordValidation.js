/**
 * ===================================================================
 * PASSWORD STRENGTH AND RULE VALIDADOR
 * ===================================================================
 * - Validation temps réel du mot de passe
 * - Affichage dynamique des règles
 * - Calcul de la force (barre + label)
 * - Nettoyage des erreurs backend à la saisie
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    const passwordInput = document.getElementById("password");
    const rulesContainer = document.querySelector(".password-rules");
    const rulesItems = document.querySelectorAll(".password-rules li");
    const strengthBar = document.getElementById("password-strength-bar");
    const strengthLabel = document.getElementById("password-strength-label");

    if (!passwordInput || !rulesContainer || !rulesItems.length) return;

    // ========================================================
    // VALIDATORS
    // ========================================================

    const validators = {
        "8 caractères minimum requis": pwd => pwd.length >= 8,
        "1 lettre majuscule requise": pwd => /[A-Z]/.test(pwd),
        "1 lettre minuscule requise": pwd => /[a-z]/.test(pwd),
        "1 chiffre requis": pwd => /\d/.test(pwd),
        "1 caractère spécial requis": pwd =>
            /[!@#$%^&*()\-_=+\[\]{};:,.?]/.test(pwd)
    };

    passwordInput.addEventListener("input", () => {

        const value = passwordInput.value;
        const formGroup = passwordInput.closest(".form-group");

        // ====================================================
        // BACKEND ERROR CLEANUP
        // ====================================================

        if (formGroup) {
            const backendError = formGroup.querySelector(".form-error");
            if (backendError) {
                backendError.remove();
                formGroup.classList.remove("has-error");
            }
        }

        // ====================================================
        // EMPTY STATE
        // ====================================================

        if (value.length === 0) {
            rulesContainer.classList.remove("visible");

            strengthBar.style.width = "0%";
            strengthBar.style.backgroundColor = "#ccc";
            strengthLabel.textContent = "";

            strengthBar.parentElement.classList.remove("visible");
            strengthLabel.classList.remove("visible");

            return;
        }

        // ====================================================
        // ACTIVE STATE
        // ====================================================

        rulesContainer.classList.add("visible");
        strengthBar.parentElement.classList.add("visible");
        strengthLabel.classList.add("visible");

        // Validation des règles
        rulesItems.forEach(item => {
            const rule = item.dataset.rule;
            const isValid = validators[rule]?.(value);

            item.classList.remove("valid", "error");
            item.classList.add(isValid ? "valid" : "error");
        });

        // ====================================================
        // STRENGTH CALCULATION
        // ====================================================

        const totalRules = rulesItems.length;
        const validRules = [...rulesItems].filter(item =>
            item.classList.contains("valid")
        ).length;

        const strengthPercent = Math.round((validRules / totalRules) * 100);
        strengthBar.style.width = `${strengthPercent}%`;

        if (strengthPercent <= 20) {
            strengthBar.style.backgroundColor = "var(--danger-2)";
            strengthLabel.textContent = "Mot de passe très faible";
        } else if (strengthPercent <= 40) {
            strengthBar.style.backgroundColor = "#f57c00";
            strengthLabel.textContent = "Mot de passe faible";
        } else if (strengthPercent <= 60) {
            strengthBar.style.backgroundColor = "#fbc02d";
            strengthLabel.textContent = "Mot de passe moyen";
        } else if (strengthPercent <= 80) {
            strengthBar.style.backgroundColor = "var(--accent-secondary)";
            strengthLabel.textContent = "Mot de passe fort";
        } else {
            strengthBar.style.backgroundColor = "var(--accent-primary)";
            strengthLabel.textContent = "Mot de passe très fort";
        }
    });
});