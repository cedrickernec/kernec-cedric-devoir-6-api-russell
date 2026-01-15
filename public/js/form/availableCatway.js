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
    feedback.textContent = msg;
    feedback.classList.remove("hidden");
    feedback.classList.add("error");
  };

  const hideError = () => {
    feedback.textContent = "";
    feedback.classList.add("hidden");
    feedback.classList.remove("error");
  }

  input.addEventListener("input", () => {
    clearTimeout(timeout);

    const value = input.value.trim();

    // Reset visuel
    hideError();

    // Champ vide → pas de requête
    if (!value) return;
    
    // Validation du format
    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    if (!Number.isFinite(number)) {
      showError("Le numéro du catway doit être un nombre valide.");
      return;
    }

    if (!Number.isInteger(number)) {
      showError("Le numéro du catway doit être un entier.");
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