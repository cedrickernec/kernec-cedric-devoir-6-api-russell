/**
 * ===================================================================
 * EMAIL AVAILABILITY CHECKER - FORM VALIDATION
 * ===================================================================
 * - Vérifie le format de l'email
 * - Vérifie l'unicité de l'email côté serveur
 * - Supporte le mode édition (excludeId)
 * - Combine validation HTML native + validation AJAX
 * - Bloque automatiquement le submit si invalide
 * ===================================================================
 * Utilise :
 *    - createAvailabilityChecker (générique)
 *    - preventSubmitIfLocked pour la sécurité formulaire
 * ===================================================================
 */

import { createAvailabilityChecker } from "./availabilityChecker.js";

// ========================================================
// AJAX AVAILABILITY CHECK
// ========================================================

createAvailabilityChecker({
  inputId: "email",
  feedbackId: "email-feedback",

  getUrl: (email, input) => {
    const form = input.closest("form");
    const userId = form?.dataset.entityId;

    let url = `/ajax/users/check-email?email=${encodeURIComponent(email)}`;

    // Ignore l'utilisateur actuel en mode édition
    if (userId) {
      url += `&excludeId=${userId}`;
    }

    return url;
  },

  validateFormat: () => null,

  conflictMessage: "Cet email est déjà utilisé."
});

// ========================================================
// HTML FORMAT VALIDATION (BLUR)
// ========================================================

const emailInput = document.getElementById("email");
const feedback = document.getElementById("email-feedback");

emailInput?.addEventListener("blur", () => {

  // Ne pas écraser une erreur AJAX verouillée
  if (emailInput.dataset.locked === "true") return;

  if (emailInput.value.trim() && !emailInput.checkValidity()) {

    // Erreur bloquante
    emailInput.dataset.invalid = "true";
    emailInput.setAttribute("aria-invalid", "true");

    feedback.textContent = "Format d'email invalide (ex : nom@domaine.com).";
    feedback.classList.remove("hidden");
    feedback.setAttribute("role", "alert");

  } else {
    // Si format correct, on libère le champ
    delete emailInput.dataset.invalid;
    emailInput.removeAttribute("aria-invalid");

    feedback.textContent = "";
    feedback.classList.add("hidden");
  }
});