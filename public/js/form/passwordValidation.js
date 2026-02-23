/**
 * ===================================================================
 * PASSWORD STRENGTH VALIDADOR - REALTIME FEEDBACK
 * ===================================================================
 * - Valide les règles du mot de passe en temps réel
 * - Met à jour visuellement chaqie règle
 * - Calcul de la force de robustesse du mot de passe (barre + label)
 * - Nettoie implicitement les erreurs backend
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // DOM REFERENCE
    // ========================================================

    const passwordInput = document.getElementById("password");
    const rulesContainer = document.querySelector(".password-rules");
    const rulesItems = document.querySelectorAll(".password-rules li");
    const strengthBar = document.getElementById("password-strength-bar");
    const strengthLabel = document.getElementById("password-strength-label");

    if (!passwordInput || !rulesContainer || !rulesItems.length) return;

    // ========================================================
    // VALIDATION RULES
    // ========================================================

    const validators = {
        "8 caractères minimum requis": pwd => pwd.length >= 8,
        "1 lettre majuscule requise": pwd => /[A-Z]/.test(pwd),
        "1 lettre minuscule requise": pwd => /[a-z]/.test(pwd),
        "1 chiffre requis": pwd => /\d/.test(pwd),
        "1 caractère spécial requis": pwd =>
            /[!@#$%^&*()\-_=+[\]{};:,.?]/.test(pwd)
    };

    // ========================================================
    // INPUT LISTENER
    // ========================================================

    passwordInput.addEventListener("input", () => {

        rulesContainer.classList.add("visible");

        const value = passwordInput.value;

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

        // ========================================================
        // VISUAL FEEDBACK
        // ========================================================
        
        if (strengthPercent <= 20) {
            strengthBar.style.backgroundColor = "#ff145c";
            strengthLabel.textContent = "Mot de passe très faible";
        } else if (strengthPercent <= 40) {
            strengthBar.style.backgroundColor = "#f57c00";
            strengthLabel.textContent = "Mot de passe faible";
        } else if (strengthPercent <= 60) {
            strengthBar.style.backgroundColor = "#fbc02d";
            strengthLabel.textContent = "Mot de passe moyen";
        } else if (strengthPercent <= 80) {
            strengthBar.style.backgroundColor = "#03a976";
            strengthLabel.textContent = "Mot de passe fort";
        } else {
            strengthBar.style.backgroundColor = "#0267c7";
            strengthLabel.textContent = "Mot de passe très fort";
        }
    });
});