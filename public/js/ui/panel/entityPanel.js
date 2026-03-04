/**
 * ENTITY PANEL MODULE
 * =========================================================================================
 * @module entityPanel
 * 
 * Contrôleur générique d'ouverture de side panel pour les entités.
 *
 * Responsabilités :
 * - Résolution d'URL dynamiques (nested routes)
 * - Chargement asynchrone du contenu
 * - Gestion des erreurs backend
 * - Configuration dynamique des actions Edit / Delete
 *
 * Dépendances :
 * - sidePanel.js (open / close / state helpers)
 *
 * Architecture :
 * → Module générique réutilisable par catwaysPanel, reservationsPanel, usersPanel
 */

import {
  openSidePanel,
  isSidePanelOpen,
  closeSidePanel,
  getCurrentEntityId
} from "./sidePanel.js";

/**
 * URL RESOLVER
 * =========================================================================================
 * Résout une URL à partir d'un template contenant des paramètres.
 *
 * Exemple :
 *  template = "/catways/:catwayNumber/reservations/:id"
 *
 * @function resolveNestedUrl
 * 
 * @param {string} template
 * @param {Object<string,string|number>} params
 *
 * @returns {string}
 */

export function resolveNestedUrl(template, params = {}) {
  let url = template;

  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });

  return url
}

/**
 * ENTITY PANEL CONTROLLER
 * =========================================================================================
 * Initialise le comportement des lignes ouvrant un side panel.
 *
 * Fonctionnalités :
 * - Charge dynamiquement le contenu via fetch
 * - Gère les erreurs backend (404 / 500)
 * - Configure dynamiquement les actions Edit / Delete
 * - Supporte les routes imbriquées (nested entities)
 *
 * @function initEntityPanel
 * 
 * @param {Object} config
 * @param {string} [config.panelTitle]
 * @param {string} [config.panelUrl]
 * @param {string} [config.nestedPanelUrl]
 * @param {Function} [config.nestedParams]
 * @param {string} [config.nestedEditUrl]
 * @param {Function} [config.nestedEditParams]
 * @param {Object} [config.deleteConfig]
 * @param {string} [config.editBaseUrl]
 * @param {string} [config.editTitle]
 * @param {Object} config.messages
 *
 * @returns {void}
 */

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
  if (!rows.length) return;

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

      // Ignore interactions internes
      if (e.target.closest("a, button, input, .actions")) return;

      const entityId = row.dataset.entityId;
      const catwayNumber = row.dataset.catwayNumber;

      // Toggle panel si déjà ouvert sur la même entité
      if (isSidePanelOpen() && getCurrentEntityId() === entityId) {
        closeSidePanel();
        clearActiveRows();
        return;
      }

      try {
        // ==================================================
        // URL BUILDING
        // ==================================================
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
        
        // ==================================================
        // ERROR HANDLING
        // ==================================================

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

        // ==================================================
        // SUCCESS CONTENT LOAD
        // ==================================================
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