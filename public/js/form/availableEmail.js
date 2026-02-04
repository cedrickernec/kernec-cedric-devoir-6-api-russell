/**
 * ===================================================================
 * EMAIL AVAILABILITY CHECKER
 * ===================================================================
 * - Vérifie le format email
 * - Vérifie l'unicité de l'email
 * - Support le mode édition via excludeId
 * - Affiche un feedback sans bloquer la soumission
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("email");
  const feedback = document.getElementById("email-feedback");
  if (!input || !feedback) return;

  let timeout;
  let lastChecked = "";

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
  };

  input.addEventListener("input", () => {

    delete input.dataset.locked;
    
    clearTimeout(timeout);

    const email = input.value.trim();

    // Reset visuel
    clearError();

    // Champ vide ou format invalide → pas de requête
    if (!email || !input.checkValidity()) return;

    // ========================================================
    // BACKEND AVAILABILITY CHECK
    // ========================================================

    // Débounce pour éviter les requêtes à chaque frappe
    timeout = setTimeout(async () => {

      // Anti-requêtes inutiles
      if (email === lastChecked) return;
      lastChecked = email;

      try {
        const form = input.closest("form");
        const userId = form?.dataset.entityId;

        let url = `/ajax/users/check-email?email=${encodeURIComponent(email)}`;

        if (userId) {
          url += `&excludeId=${userId}`;
        }

        const res = await fetch(url, { credentials: "same-origin" });

        const data = await res.json();

        if (!data.available) {
          showError("Cet email est déjà utilisé.")
        } else {
          clearError();
        }
        
      } catch (err) {
        // Le backend valide au submit
      }
    }, 400);
  });

  // Au blur, si invalide HTML → aria-ivalid "true" pour garder l'erreur
  input.addEventListener("blur", () => {
    if (input.value.trim() && !input.checkValidity()) {
      input.dataset.invalid = "true";
    }
  });
});