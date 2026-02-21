/**
 * ===================================================================
 * CATWAY NUMBER AVAILABILITY CHECKER - FORM VALIDATION
 * ===================================================================
 * - Vérifie le format du numéro de catway
 * - Vérifie son unicité côté serveur
 * - Supporte le mode édition (excludeId)
 * - Bloque automatiquement le submit si invalide
 * ===================================================================
 * Utilise :
 *    - createAvailabilityChecker (générique)
 *    - preventSubmitIfLocked pour la sécurité formulaire
 * ===================================================================
 */

import { createAvailabilityChecker } from "./availabilityChecker.js";

createAvailabilityChecker({
  inputId: "catwayNumber",
  feedbackId: "catwayNumber-feedback",

  // ========================================================
  // URL BUILDER
  // ========================================================

  getUrl: (value, input) => {
    const form = input.closest("form");
    const currentCatwayId = form?.dataset.catwayId;

    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    const params = new URLSearchParams({ number });

    // Ignore le catway actuel en mode édition
    if (currentCatwayId) {
      params.append("excludeId", currentCatwayId);
    }

    return `/ajax/catways/check-number?${params.toString()}`;
  },

  // ========================================================
  // LOCAL FORMAT VALIDATION
  // ========================================================

  validateFormat: (value) => {
    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    if (!Number.isInteger(number)) {
      return "Le numéro du catway doit être un nombre entier.";
    }

    if (number < 1) {
      return "Le numéro du catway doit être supérieur ou égal à 1.";
    }

    return null;
  },

  conflictMessage: "Ce numéro de catway est déjà utilisé."
});