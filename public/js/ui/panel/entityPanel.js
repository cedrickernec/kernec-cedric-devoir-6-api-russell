/**
 * ===================================================================
 * SIDE PANEL CONTROLLER
 * ===================================================================
 * - Gère l'ouverture du side panel au clic sur une ligne
 * - Charge dynamiquement le contenu HTML
 * - Synchronise l'état actif des lignes
 * - Gère les erreurs backend
 * ===================================================================
 */

import {
  openSidePanel,
  isSidePanelOpen,
  closeSidePanel,
  getCurrentEntityId
} from "./sidePanel.js";

// ==================================================
// URL RESOLVER
// ==================================================

export function resolveNestedUrl(template, params = {}) {
  let url = template;

  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });

  return url
}

// ==================================================
// INIT
// ==================================================

export function initEntityPanel({
  panelTitle,
  panelUrl,
  nestedPanelUrl,
  nestedParams,
  nestedEditUrl,
  nestedEditParams,
  deleteConfig,
  editBaseUrl,
  editTitle,
  messages
}) {

  // ==================================================
  // DOM REFERENCES
  // ==================================================

  const rows = document.querySelectorAll(".js-panel-row");

  // ==================================================
  // UI HELPERS
  // ==================================================

  function clearActiveRows() {
    rows.forEach(row => row.classList.remove("is-active"));
  }

  // ==================================================
  // ROW CLICK HANDLING
  // ==================================================

  rows.forEach(row => {
    row.addEventListener("click", async (e) => {
      e.stopPropagation();

      // Ignore les clics sur actions internes
      if (e.target.closest("a, button, input, .actions")) return;

      const entityId = row.dataset.entityId;
      const catwayNumber = row.dataset.catwayNumber;

      // Toggle panel si déjà ouvert sur la même entité
      if (isSidePanelOpen() && getCurrentEntityId() === entityId) {
        closeSidePanel();
        clearActiveRows();
        return;
      }

      // ==================================================
      // PANEL CONTENT LOADING
      // ==================================================

      try {
        let url;
        
        if (nestedPanelUrl && nestedParams) {
          url = resolveNestedUrl(nestedPanelUrl, {
            id: entityId,
            ...nestedParams(row)
          });
        } else {
          url = `${panelUrl}/${entityId}/panel`;
        }
        
        const res = await fetch(url);

        // ---------- Gestion erreurs ----------
        if (!res.ok) {
          let message = messages.SERVER_ERROR_SHORT;

          if (res.status === 404) message = messages.NOT_FOUND;
          if (res.status === 500) message = messages.SERVER_ERROR_LONG;

          openSidePanel({
            title: "Erreur",
            content: `
              <div class="panel-error" data-panel-error="true">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>${message}</p>
              </div>
            `,
            entityId: null
          });

          clearActiveRows();
          row.classList.add("is-active");
          return;
        }

        // ---------- Contenu OK ----------
        const html = await res.text();

        clearActiveRows();
        row.classList.add("is-active");

        let deleteUrl = null;

        if (deleteConfig?.deleteUrlTemplate) {
          deleteUrl = resolveNestedUrl(deleteConfig.deleteUrlTemplate, {
            id: entityId,
            catwayNumber
          });
        }

        openSidePanel({
          title: panelTitle,
          content: html,
          entityId,

          editTitle,
          editBaseUrl,
          nestedEditUrl: nestedEditUrl || null,
          nestedEditParams: nestedEditParams
            ? JSON.stringify({
              id: entityId,
              ...nestedEditParams(row)
            })
            : null,
            
          actions: deleteConfig
            ? {
                delete: {
                  url: deleteUrl,
                  rowSelector: `.js-panel-row[data-entity-id="${entityId}"]`,
                  confirmMessage: deleteConfig.confirmMessage,
                  type: deleteConfig.type
                }
              }
            : null
        });

      } catch (err) {
        console.error("Erreur chargement panel", err);
      }
    });
  });
}