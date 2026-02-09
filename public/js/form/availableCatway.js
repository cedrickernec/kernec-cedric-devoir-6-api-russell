/**
 * ===================================================================
 * CATWAY NUMBER AVAILABILITY CHECKER
 * ===================================================================
 * - Valide le format du numéro de catway
 * - Vérifie la disponibilité du numéro de catway
 * - Supporte le mode édition via excludeId
 * - Gère l'état visuel du champ
 * - Bloque automatiquement le submit si une erreur est détectée
 * ===================================================================
 * => Fonctionne avec le script générique preventSubmitIfLocked <=
 * ===================================================================
 */

import { createAvailabilityChecker } from "./availabilityChecker.js";

createAvailabilityChecker({
  inputId: "catwayNumber",
  feedbackId: "catwayNumber-feedback",

  getUrl: (value, input) => {
    const form = input.closest("form");
    const currentCatwayId = form?.dataset.catwayId;

    const normalized = value.replace(",", ".");
    const number = Number(normalized);

    const params = new URLSearchParams({ number });

    if (currentCatwayId) {
      params.append("excludeId", currentCatwayId);
    }

    return `/ajax/catways/check-number?${params.toString()}`;
  },

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