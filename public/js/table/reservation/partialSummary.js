/**
 * ===================================================================
 * RESERVATION PARTIAL SUMMARY CONTROLLER
 * ===================================================================
 * - Met à jour les cellules de résumé par catway
 * - Affiche dynamiquement :
 *      → le nombre total de créneaux disponibles
 *      → ou le nombre de créneaux sélectionnés
 * - Synchronisé avec le selectionStore global
 * ===================================================================
 * Déclenché par selection:change (reservationSelection.js)
 * ===================================================================
 */

import { countSelectionsByCatway } from "../core/selectionStore.js";

// ========================================================
// UPDATE ONE SUMMARY CELL
// ========================================================

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

// ========================================================
// REFRESH ALL SUMMARIES
// ========================================================

export function refreshAllPartialSummaries() {
  document.querySelectorAll("[data-partial-summary]").forEach(cell => {
    updatePartialSummary(cell.dataset.partialSummary);
  });
}
