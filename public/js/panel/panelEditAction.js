/**
 * ===================================================================
 * ACTION MANAGER EDIT IN PANEL
 * ===================================================================
 * - Redirige vers la page d'édition de l'entité courante
 * - Utilise l'ID stocké dans l'état du side panel
 * ===================================================================
*/

import { getCurrentEntityId } from "../ui/panel/sidePanel.js";
import { resolveNestedUrl } from "../ui/panel/entityPanel.js";

const panel = document.getElementById("side-panel");

panel?.addEventListener("click", (e) => {
  const editBtn = e.target.closest("[data-panel-action='edit']");
  if (!editBtn) return;

  const entityId = getCurrentEntityId();
  if (!entityId) return;

  const baseUrl = editBtn.dataset.editBase;
  const nestedEditUrl = editBtn.dataset.nestedEditUrl;
  const nestedEditParams = editBtn.dataset.nestedEditParams;

  let finalUrl;

  if (nestedEditUrl && nestedEditParams) {
    finalUrl = resolveNestedUrl(nestedEditUrl, {
      id: entityId,
      ...JSON.parse(nestedEditParams)
    });
  } else {
    finalUrl = `${baseUrl}/${entityId}/edit`
  }

  window.location.href = finalUrl;
});