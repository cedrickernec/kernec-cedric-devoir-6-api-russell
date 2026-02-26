/**
 * SIDE PANEL - DELETE ACTION HANDLER
 * =========================================================================================
 * @module panelDeleteAction
 * 
 * Gère l’action de suppression depuis le side panel.
 *
 * Fonctionnalités :
 * - Récupère les URLs dynamiques via data-attributes
 * - Lance le delete flow générique
 * - Anime la suppression visuelle de la ligne
 * - Ferme le panel après succès
 *
 * Dépendances :
 * - runDeleteFlow()
 * - closeSidePanel()
 * - showToast()
 * 
 * Événement écouté :
 * - Click sur [data-panel-action = "delete"]
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

  const checkUrl = btn.dataset.checkUrl;
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
    checkUrl,
    deleteUrl,
    deleteType: entityType,
    count: 1,

    buildBody: (password) => ({ password }),

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