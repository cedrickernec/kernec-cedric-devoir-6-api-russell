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
  const form = input?.closest("form");

  if (!input || !feedback) return;

  // Présent en mode édition uniquement
  const currentUserId = form?.dataset.entityId;
  let timeout;

  input.addEventListener("input", () => {
    clearTimeout(timeout);

    const email = input.value.trim();

    // Reset
    feedback.textContent = "";
    feedback.classList.add("hidden");
    feedback.classList.remove("error");

    // Champ vide ou format invalide → pas de requête
    if (!email || !input.checkValidity()) return;

    // ========================================================
    // BACKEND AVAILABILITY CHECK
    // ========================================================

    // Débounce pour éviter les requêtes à chaque frappe
    timeout = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          email: email
        });

        if (currentUserId) {
          params.append("excludeId", currentUserId);
        }

        const res = await fetch(
          `/users/ajax/check-email?${params.toString()}`,
          { credentials: "same-origin" }
        );

        const data = await res.json();

        if (!data.available) {
          feedback.textContent = "Cet email est déjà utilisé.";
          feedback.classList.remove("hidden");
          feedback.classList.add("error");
        }
        
      } catch (err) {
        // Le backend valide au submit
      }
    }, 400);
  });
});