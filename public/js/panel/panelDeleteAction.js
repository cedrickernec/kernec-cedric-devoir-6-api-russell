/**
 * ===================================================================
 * PANEL DELETE ACTION
 * ===================================================================
 * - Gère la suppression d'une entité depuis le side panel
 * - Affiche une modale de confirmation
 * - Déclenche la requête DELETE
 * - Gère le cas password_required
 * - Anime la suppression de la ligne
 * - Affiche un toast de feedback
 * ===================================================================
 */

/* global showToast */
import { closeSidePanel } from "../ui/panel/sidePanel.js";
import { COMMON_MESSAGES } from "../messages/commonMessages.js";
import { runDeleteFlow } from "../delete/deleteFlow.js";

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

  runDeleteFlow({
    deleteUrl,
    deleteType: entityType,
    count: 1,

    buildBody: (password => ({ password })),

    onSuccess: () => {
      const row = document.querySelector(rowSelector);
      if (row) {
        row.classList.add("row-exit");
        row.addEventListener("animationend", () => row.remove(), { once: true })
      }

      closeSidePanel();
    },

    onCancel: () => {
      showToast("info", COMMON_MESSAGES.DELETE_CANCEL)
    }
  });
});