/**
 * RESERVATION PAGE — SELECTION STATE CONTROLLER
 * =========================================================================================
 * @module reservationSelection
 * 
 * Contrôleur principal de la page Réservation.
 *
 * Responsabilités :
 * - Initialise la validation de réservation
 * - Écoute les événements globaux "selection:change"
 * - Met à jour dynamiquement :
 *      → le bouton de validation
 *      → les résumés partiels de créneaux
 *
 * Dépendances :
 * - selectionStore (getSelections)
 * - partialSummary (updatePartialSummary, refreshAllPartialSummaries)
 * - initReservationValidation()
 *
 * Événements écoutés :
 * - "selection:change"
 *
 * Effet de bord :
 * - Manipule le DOM
 * - Active / Désactive le bouton de validation
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

  // Format attendu : "catwayNumber|slotId"
  const [catwayNumber] = id.split("|");

  updateValidationButton();
  updatePartialSummary(catwayNumber);
  refreshAllPartialSummaries();
});

function updateValidationButton() {

  // Met à jour le bouton de validation
  const button = document.getElementById("validate-selection");
  if (!button) return;

  // Met à jour le compteur dynamique
  const count = getSelections().size;
  button.textContent = `Valider (${count})`;
  button.disabled = count === 0;
}