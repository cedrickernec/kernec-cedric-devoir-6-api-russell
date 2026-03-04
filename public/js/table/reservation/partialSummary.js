/**
 * RESERVATION PARTIAL SUMMARY CONTROLLER
 * =========================================================================================
 * @module partialSummary
 * 
 * Met à jour les cellules de résumé par catway.
 * 
 * - Affiche le total de créneaux disponibles (état initial)
 * - Affiche le nombre de créneaux sélectionnés (état actif)
 * - Synchronisation avec selectionStore (countSelectionByCatway)
 * 
 * Dépendances :
 * - selectionStore (countSelectionsByCatway)
 * - Cellules [data-partial-summary] + data-total-slots
 * 
 * Déclenché par :
 * - selection:change (reservationSelection.js)
 */

import { countSelectionsByCatway } from "../core/selectionStore.js";

/**
 * UPDATE ONE SUMMARY CELL
 * =========================================================================================
 * Met à jour le résumé d'un catway donné.
 * 
 * @function updatePartialSummary
 * 
 * @param {string|number} catwayNumber - Numéro du catway cible
 * 
 * @returns {void}
 */

export function updatePartialSummary(catwayNumber) {
  const summaryCell = document.querySelector(
    `[data-partial-summary="${catwayNumber}"]`
  );
  if (!summaryCell) return;

  const total = Number(summaryCell.dataset.totalSlots);
  const selectedCount = countSelectionsByCatway(catwayNumber);

  // ========================================================
  // NO SELECTION STATE
  // ========================================================

  if (selectedCount === 0) {
    summaryCell.textContent =
      `${total} créneau${total > 1 ? "x" : ""} disponible${total > 1 ? "s" : ""}`;
    summaryCell.classList.add("muted");
    summaryCell.classList.remove("bold");

  // ========================================================
  // ACTIVE SELECTION STATE
  // ========================================================
  
  } else {
    summaryCell.textContent =
      `${selectedCount} créneau${selectedCount > 1 ? "x" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`;
    summaryCell.classList.remove("muted");
    summaryCell.classList.add("bold");
  }
}

/**
 * REFRESH ALL SUMMARIES
 * =========================================================================================
 * Rafraîchit tous les résumés partiels affichés.
 * 
 * @function refreshAllPartialSummaries
 * 
 * @returns {void}
 */

export function refreshAllPartialSummaries() {
  document.querySelectorAll("[data-partial-summary]").forEach(cell => {
    updatePartialSummary(cell.dataset.partialSummary);
  });
}
