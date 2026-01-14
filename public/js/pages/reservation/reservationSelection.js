/**
 * ===================================================================
 * RESERVATION PAGE — SELECTION HANDLING
 * ===================================================================
 * - Réagit aux changements de sélection
 * - Met à jour :
 *   - le bouton de validation
 *   - les résumés de créneaux partiels
 * - Initialise la validation finale
 * ===================================================================
 */

import { getSelections } from "../../table/core/selectionStore.js";
import {
  updatePartialSummary,
  refreshAllPartialSummaries
} from "../../table/reservation/partialSummary.js";
import { initReservationValidation } from "./reservationValidationController.js";

// ==================================================
// INITIALISATION
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
  initReservationValidation();
  refreshAllPartialSummaries();
});

// ==================================================
// SELECTION EVENTS
// ==================================================

document.addEventListener("selection:change", event => {
  const { id } = event.detail;
  const [catwayNumber] = id.split("|");

  updateValidationButton();
  updatePartialSummary(catwayNumber);
  refreshAllPartialSummaries();
});

// ==================================================
// UI HELPERS
// ==================================================

function updateValidationButton() {
  const button = document.getElementById("validate-selection");
  if (!button) return;

  const count = getSelections().size;
  button.textContent = `Valider (${count})`;
  button.disabled = count === 0;
}