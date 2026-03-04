/**
 * GENERIC SELECTION CONTROLLER
 * =========================================================================================
 * @module selectionController
 * 
 * Contrôleur générique de sélection UI.
 *
 * - Gère le toggle des boutons ".btn-toggle"
 * - Synchronise l'état visuel (classe CSS)
 * - Met à jour le selectionStore global
 * - Met à jour l'attribut aria-pressed
 * - Émet un événement global "selection:change"
 *
 * Dépendances :
 * - selectionStore (addSelection, removeSelection, hasSelection)
 * - Boutons avec data-selection-id
 *
 * Événement émis :
 * - "selection:change"
 *   detail: { id: string, active: boolean }
 */

import {
  addSelection,
  removeSelection,
  hasSelection
} from "../table/core/selectionStore.js";

// ========================================================
// GLOBAL CLICK LISTENER (EVENT DELEGATION)
// ========================================================

document.addEventListener("click", event => {

  // Recherche d'un bouton toggle
  const button = event.target.closest(".btn-toggle");

  // Ignore si non concerné ou temporairement verouillé
  if (!button || button.classList.contains("is-locked")) return;

  const id = button.dataset.selectionId;
  if (!id) return;

  const isActive = hasSelection(id);

  // ========================================================
  // DOUBLE CLICK PROTECTION
  // ========================================================

  // Lock temporaire pour éviter les double-clicks
  button.classList.add("is-locked");
  setTimeout(() => button.classList.remove("is-locked"), 750);

  // ========================================================
  // STATE SYNCHRONISATION
  // ========================================================

  if (!isActive) {
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    addSelection(id);
  } else {
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
    removeSelection(id);
  }

  // ========================================================
  // GLOBAL EVENT EMISSION
  // ========================================================

  // Permet aux autres modules d'écouter les changements
  document.dispatchEvent(
    new CustomEvent("selection:change", {
      detail: { id, active: !isActive }
    })
  );
  
});