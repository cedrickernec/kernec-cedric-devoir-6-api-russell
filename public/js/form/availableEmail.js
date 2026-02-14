/**
 * ===================================================================
 * EMAIL AVAILABILITY CHECKER
 * ===================================================================
 * - Vérifie le format email
 * - Vérifie l'unicité de l'email
 * - Supporte le mode édition via excludeId
 * - Gère l'état visuel du champ
 * - Bloque automatiquement le submit si une erreur est détectée
 * ===================================================================
 * => Fonctionne avec le script générique preventSubmitIfLocked <=
 * ===================================================================
 */

import { createAvailabilityChecker } from "./availabilityChecker.js";

createAvailabilityChecker({
  inputId: "email",
  feedbackId: "email-feedback",

  getUrl: (email, input) => {
    const form = input.closest("form");
    const userId = form?.dataset.entityId;

    let url = `/ajax/users/check-email?email=${encodeURIComponent(email)}`;

    if (userId) {
      url += `&excludeId=${userId}`;
    }

    return url;
  },

  validateFormat: () => null,

  conflictMessage: "Cet email est déjà utilisé."
});

// Gestion spécifique du format au blur
const emailInput = document.getElementById("email");
const feedback = document.getElementById("email-feedback");

emailInput?.addEventListener("blur", () => {

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