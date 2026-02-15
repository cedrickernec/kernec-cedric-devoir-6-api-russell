/**
 * ===================================================================
 * SIDE PANEL - DELETE ACTION HANDLER
 * ===================================================================
 * - Gère la suppression d'une entité depuis le side panel
 * - Lance le delete flow générique (confirmation + API)
 * - Anime la suppression visuelle de la ligne associée
 * - Affiche un toast feedback selon résultat
 * ===================================================================
 * Fonctionnement :
 * - Le bouton delete est configuré dynamiquement via
 *   les data-attributes ijectés lors de l'ouverture du panel
 * ===================================================================
 */

/* global showToast */

import { closeSidePanel } from "../ui/panel/sidePanel.js";
import { COMMON_MESSAGES } from "../messages/commonMessages.js";
import { runDeleteFlow } from "../delete/deleteFlow.js";

// ==================================================
// PANEL EVENT LISTENER
// ==================================================

const panel = document.getElementById("side-panel");

panel?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-panel-action='delete']");
  if (!btn) return;

  const deleteUrl = btn.dataset.deleteUrl;
  const rowSelector = btn.dataset.rowSelector;
  const entityType = btn.dataset.entityType;

  if (!deleteUrl) {
    console.warn("Aucune URL de suppression définie pour le panel");
    return;
  }

  // ==================================================
  // DELETE FLOW EXECUTION
  // ==================================================

  runDeleteFlow({
    deleteUrl,
    deleteType: entityType,
    count: 1,

    buildBody: (password => ({ password })),

    // ==================================================
    // SUCCESS HANDLER
    // ==================================================

    onSuccess: () => {

      // Animation de suppression de la ligne UI
      const row = document.querySelector(rowSelector);
      if (row) {
        row.classList.add("row-exit");
        row.addEventListener("animationend", () => row.remove(), { once: true })
      }

      closeSidePanel();
    },

    // ==================================================
    // CANCEL HANDLER
    // ==================================================

    onCancel: () => {
      showToast("info", COMMON_MESSAGES.DELETE_CANCEL)
    }
  });
});