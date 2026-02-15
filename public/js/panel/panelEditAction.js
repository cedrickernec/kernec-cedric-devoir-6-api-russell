/**
 * ===================================================================
 * SIDE PANEL - EDIT ACTION HANDLER
 * ===================================================================
 * - Redirige vers la page d'édition de l'entité active
 * - Supporte deux modes :
 *      → Édition simple (/entity/:id/edit)
 *      → Édition imbriquée (nested resource)
 * ===================================================================
 * Source des données :
 * - L'ID courant provient de l'état interne du side panel
 * - Les URLs sont injectés dynamiquement via data-attributes
 * ===================================================================
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