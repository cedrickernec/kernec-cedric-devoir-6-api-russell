/**
 * ===================================================================
 * GENERIC AVAILABILITY CHECKER - FORM VALIDATION
 * ===================================================================
 * - Gère la vérification asynchrone de disponibilité d'un champ
 * - Applique un debounce pour limiter les appels AJAX
 * - Synchronise l'état visuel du champs (invalid / locked)
 * - Empêche la soumission via preventSubmitIfLocked
 * ===================================================================
 * Réutilisable pour n'importe quel input.
 * ===================================================================
 */

export function createAvailabilityChecker({
    inputId,
    feedbackId,
    getUrl,
    validateFormat,
    conflictMessage
}) {
  document.addEventListener("DOMContentLoaded", () => {

    // ========================================================
    // DOM REFERENCE
    // ========================================================

    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);

    if (!input || !feedback) return;

    // ========================================================
    // INTERNAL STATE
    // ========================================================

    let timeout;
    let lastChecked = "";

    // ========================================================
    // UI STATE HELPERS
    // ========================================================

    // Affiche une erreur bloquante et verouille le champ
    const showError = (msg) => {
        input.dataset.invalid = "true";
        input.dataset.locked = "true";
        input.setAttribute("aria-invalid", "true");

        feedback.textContent = msg;
        feedback.classList.remove("hidden");
        feedback.setAttribute("role", "alert");

        // Marque l'erreur comme provenant d'un contrôle AJAX
        feedback.dataset.source = "ajax";
    };

    // Nettoie totalement l'état d'erreur
    const clearError = () => {
        delete input.dataset.invalid;
        delete input.dataset.locked;
        input.removeAttribute("aria-invalid");

        feedback.textContent = "";
        feedback.classList.add("hidden");

        delete feedback.dataset.source;

        lastChecked = "";
    };

    // ========================================================
    // AJAX VALIDATION
    // ========================================================

    const checkAvailability = async (value) => {
        try {
            const url = getUrl(value, input);
            const res = await fetch(url, { credentials: "same-origin" });

            if (!res.ok) return;

            const data = await res.json();

            if (!data.available) {
                showError(conflictMessage);
            } else {
                clearError();
            }

        } catch {
            // Le backend valide au submit
        }
    };

    // ========================================================
    // INPUT EVENTS (DEBOUNCED)
    // ========================================================

    input.addEventListener("input", () => {

        // Déverouille lors d'une nouvelle saisie
        delete input.dataset.locked;

        clearTimeout(timeout);

        const value = input.value.trim();

        clearError();

        if (!value) return;

        // Validation locale avant appel serveur
        const formatError = validateFormat(value);

        if (formatError) {
            showError(formatError);
            return;
        }

        timeout = setTimeout(async () => {

            // Évite les appels identiques successifs
            if (value === lastChecked) return;

            lastChecked = value;

            await checkAvailability(value);

        }, 400);
    });

    // ========================================================
    // BLUR CLEANUP
    // ========================================================

    input.addEventListener("blur", () => {
        if (!input.dataset.invalid) {
            input.removeAttribute("aria-invalid");
        }
    });
  });
}