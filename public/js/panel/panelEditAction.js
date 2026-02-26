/**
 * SIDE PANEL - EDIT ACTION HANDLER
 * =========================================================================================
 * @module panelEditAction
 * 
 * Gère l’action d’édition depuis le side panel.
 *
 * Supporte :
 * - Mode standard : /entity/:id/edit
 * - Mode nested : ressource imbriquée
 *
 * Dépendances :
 * - getCurrentEntityId()
 * - resolveNestedUrl()
 *
 * Effets de bord :
 * - Redirection navigateur (window.location.href)
 *
 * Événement écouté :
 * - Click sur [data-panel-action = "edit"]
 */

import { getCurrentEntityId } from "../ui/panel/sidePanel.js";
import { resolveNestedUrl } from "../ui/panel/entityPanel.js";

// ==================================================
// PANEL EVENT LISTENER
// ==================================================

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

  // ==================================================
  // NESTED EDIT MODE
  // ==================================================

  if (nestedEditUrl && nestedEditParams) {
    finalUrl = resolveNestedUrl(nestedEditUrl, {
      id: entityId,
      ...JSON.parse(nestedEditParams)
    });
    
  } else {

    // ==================================================
    // STANDARD EDIT MODE
    // ==================================================

    finalUrl = `${baseUrl}/${entityId}/edit`
  }

  // Redirection navigateur
  window.location.href = finalUrl;
});