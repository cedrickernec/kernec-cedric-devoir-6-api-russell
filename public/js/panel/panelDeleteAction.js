/**
 * ===================================================================
 * PANEL DELETE ACTION
 * ===================================================================
 * - Gère la suppression d'une entité depuis le side panel
 * - Affiche une modale de confirmation
 * - Déclenche la requête DELETE
 * - Anime la suppression de la ligne
 * - Affiche un toast de feedback
 * ===================================================================
 */

import { closeSidePanel } from "../ui/panel/sidePanel.js";
import { COMMON_MESSAGES } from "../messages/commonMessages.js";

const panel = document.getElementById("side-panel");

panel?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-panel-action='delete']");
  if (!btn) return;

  const deleteUrl = btn.dataset.deleteUrl;
  const rowSelector = btn.dataset.rowSelector;

  if (!deleteUrl) {
    console.warn("Aucune URL de suppression définie pour le panel");
    return;
  }

  const p = document.createElement("p");
  p.className = "modal-text";
  p.textContent = btn.dataset.confirmMessage;

  window.openConfirmModal({
    title: "Confirmation",
    content: p,

    onConfirm: async () => {
      const res = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        window.showToast("error", COMMON_MESSAGES.DELETE_ERROR);
        return;
      }

      const row = document.querySelector(rowSelector);
      if (row) {
        row.classList.add("row-exit");
        row.addEventListener("animationend", () => row.remove(), { once: true });
      }

      closeSidePanel();
      window.showToast("success", COMMON_MESSAGES.DELETE_SUCCESS);
    },

    onCancel: () => {
      window.showToast("info", COMMON_MESSAGES.DELETE_CANCEL);
    }
  });
});