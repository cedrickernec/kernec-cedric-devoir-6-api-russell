/**
 * ===================================================================
 * ACTION MANAGER EDIT IN PANEL
 * ===================================================================
 * - Redirige vers la page d'édition de l'entité courante
 * - Utilise l'ID stocké dans l'état du side panel
 * ===================================================================
*/

import { getCurrentEntityId } from "../ui/panel/sidePanel.js";

const panel = document.getElementById("side-panel");

panel?.addEventListener("click", (e) => {
  const editBtn = e.target.closest("[data-panel-action='edit']");
  if (!editBtn) return;

  const entityId = getCurrentEntityId();
  if (!entityId) return;

  const baseUrl = editBtn.dataset.editBase;
  if (!baseUrl) {
    console.warn("Aucune base URL définie pour l'édition");
    return;
  }

  window.location.href = `${baseUrl}/${entityId}/edit`;
});