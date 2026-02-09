/**
 * ===================================================================
 * GENERIC AVAILABILITY CHECKER
 * ===================================================================
 * - Gère le debounce
 * - Gère l'état visuel (invalid / locked)
 * - Gère l'appel AJAX
 * - Fonctionne avec n'importe quel champ
 * ===================================================================
 */

export function createAvailabilityChecker({
    inputId,
    feedbackId,
    getUrl,
    validateFormat,
    formatErrorMessage,
    conflictMessage
}) {
  document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById(inputId);
    const feedback = document.getElementById(feedbackId);

    if (!input || !feedback) return;

    let timeout;
    let lastChecked = "";

    const showError = (msg) => {
        input.dataset.invalid = "true";
        input.dataset.locked = "true";
        input.setAttribute("aria-invalid", "true");

        feedback.textContent = msg;
        feedback.classList.remove("hidden");
        feedback.setAttribute("role", "alert");
    };

    const clearError = () => {
        delete input.dataset.invalid;
        delete input.dataset.locked;
        input.removeAttribute("aria-invalid");

        feedback.textContent = "";
        feedback.classList.add("hidden");

        lastChecked = "";
    };

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

    input.addEventListener("input", () => {

        delete input.dataset.locked;

        clearTimeout(timeout);

        const value = input.value.trim();

        clearError();

        if (!value) return;

        const formatError = validateFormat(value);

        if (formatError) {
            showError(formatError);
            return;
        }

        timeout = setTimeout(async () => {

            if (value === lastChecked) return;

            lastChecked = value;

            await checkAvailability(value);

        }, 400);
    });

    input.addEventListener("blur", () => {
        if (!input.dataset.invalid) {
            input.removeAttribute("aria-invalid");
        }
    });
  });
}