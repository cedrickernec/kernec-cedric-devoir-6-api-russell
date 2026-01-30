/**
 * ===================================================================
 * CATWAY NUMBER AVAILABILITY CHECKER
 * ===================================================================
 * - Valide le format du numéro de catway
 * - Vérifie la disponibilité du numéro de catway
 * - Supporte le mode édition via excludeId
 * - Affiche un feedback sans bloquer la soumission
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("catwayNumber");
  const feedback = document.getElementById("catwayNumber-feedback");
  const form = input?.closest("form");

  if (!input || !feedback) return;

  const currentCatwayId = form?.dataset.catwayId;
  let timeout;

  const showError = (msg) => {
    input.dataset.invalid = "true";
    input.dataset.locked = "true";
    input.setAttribute("aria-invalid", "true");
    feedback.textContent = msg;
    feedback.classList.remove("hidden");
  };

  const clearError = () => {
    delete input.dataset.invalid;
    delete input.dataset.locked;
    input.removeAttribute("aria-invalid");
    feedback.textContent = "";
    feedback.classList.add("hidden");
  }

  input.addEventListener("input", () => {

    clearTimeout(timeout);

    delete input.dataset.locked;

    const value = input.value.trim();

    // Reset visuel
    clearError();

    // Champ vide → pas de requête
    if (!value) {
      clearError();
      return
    };
    
    // Validation du format
    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    if (!Number.isInteger(number)) {
      showError("Le numéro du catway doit être un nombre entier.");
      return;
    };

    if (number <1) {
      showError("Le numéro du catway doit être supérieur ou égal à 1.");
      return;
    }

    // ========================================================
    // BACKEND AVAILABILITY CHECK
    // ========================================================

    // Débounce pour éviter les requêtes à chaque frappe
    timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ number });

        if (currentCatwayId) {
          params.append("excludeId", currentCatwayId);
        }
        const res = await fetch(
          `/catways/ajax/check-number?${params.toString()}`,
          { credentials: "same-origin" }
        );

        if (!res.ok) return;

        const { available } = await res.json();

        if (!available) {
          showError("Ce numéro de catway est déjà utilisé.");
        }

      } catch {
        // Le backend valide au submit
      }
    }, 400);
  });
});