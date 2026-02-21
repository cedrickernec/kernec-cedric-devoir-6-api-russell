/**
 * ===================================================================
 * RESERVATION PAGE — SELECTION STATE CONTROLLER
 * ===================================================================
 * - Écoute les changements de sélection utilisateur
 * - Met à jour dynamiquement l'interface :
 *      → bouton de validation
 *      → résumé de créneaux partiels
 * - Initialise la logique de validation de réservation
 * ===================================================================
 * Rôle :
 * - Ce fichier agit comme contrôleur principal de la page réservation
 * - Il orchestre les modules sans contenir de logique métier
 * ===================================================================
 */

import { getSelections } from "../../table/core/selectionStore.js";
import {
  updatePartialSummary,
  refreshAllPartialSummaries
} from "../../table/reservation/partialSummary.js";
import { initReservationValidation } from "./reservationValidationController.js";

// ==================================================
// PAGE INITIALIZATION
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

  // Initialise le contrôleur de validation
  initReservationValidation();
  // Synchronise les résumés éxistants
  refreshAllPartialSummaries();
});

// ==================================================
// GLOBAL SELECTION EVENTS
// ==================================================

document.addEventListener("selection:change", event => {

  const { id } = event.detail;

  // Format attendu : "catwayNumber|shotId"
  const [catwayNumber] = id.split("|");

  updateValidationButton();
  updatePartialSummary(catwayNumber);
  refreshAllPartialSummaries();
});

// ==================================================
// UI HELPERS
// ==================================================

function updateValidationButton() {

  // Met à jour le bouton de validation
  const button = document.getElementById("validate-selection");
  if (!button) return;

  // Met à jour le compteur dynamique
  const count = getSelections().size;
  button.textContent = `Valider (${count})`;
  button.disabled = count === 0;
}