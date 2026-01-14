/**
 * ===================================================================
 * GENERIC SELECTION CONTROLLER
 * ===================================================================
 * - Gère la sélection / désélection générique des boutons ".btn-toggle"
 * - Met à jour le store de sélection
 * - Émet un événement global "selection:change"
 * ===================================================================
 */

import { addSelection, removeSelection, hasSelection } from "../table/core/selectionStore.js";

document.addEventListener("click", event => {
  const button = event.target.closest(".btn-toggle");
  if (!button || button.classList.contains("is-locked")) return;

  const id = button.dataset.selectionId;
  if (!id) return;

  const isActive = hasSelection(id);

  // Lock temporaire pour éviter les double-clicks
  button.classList.add("is-locked");
  setTimeout(() => button.classList.remove("is-locked"), 750);

  // Toggle visuel + store + aria
  if (!isActive) {
    button.classList.add("is-active");
    button.setAttribute("aria-pressed", "true");
    addSelection(id);
  } else {
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
    removeSelection(id);
  }

  // Événement global pour les pages consommatrices
  document.dispatchEvent(
    new CustomEvent("selection:change", {
      detail: { id, active: !isActive }
    })
  );
});