/**
 * SIDE PANEL UI CONTROLLER
 * =========================================================================================
 * @module sidePanel
 * 
 * Contrôleur UI du side panel.
 *
 * Responsabilités :
 * - Ouvrir / fermer le panel
 * - Injecter dynamiquement le contenu HTML
 * - Configurer dynamiquement les actions (Edit / Delete)
 * - Gérer l'accessibilité (focus trap + Escape)
 * - Exposer des helpers d'état
 *
 * Dépendances :
 * - escapeManager
 * - createFocusTrap
 */

import { escapeManager } from "../accessibility/escapeManager.js";
import { createFocusTrap } from "../accessibility/focusTrap.js";
import { isKeyboardInteraction } from "../accessibility/interactionMode.js";

// ==================================================
// DOM REFERENCES
// ==================================================

const panel = document.getElementById("side-panel");
if (!panel) {
  console.warn("side-panel introuvable");
}

const focusTrap = createFocusTrap(panel);

const panelToggle = document.getElementById("side-panel-toggle");
const panelTitle = document.getElementById("side-panel-title");
const panelContent = document.getElementById("side-panel-content");
const panelActions = panel?.querySelector(".side-panel-actions");

// ==================================================
// INTERNAL STATE
// ==================================================

let currentEntityId = null;

/**
 * OPEN PANEL
 * =========================================================================================
 * Ouvre le side panel et configure ses actions.
 *
 * @function openSidePanel
 * 
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.content
 * @param {string|null} options.entityId
 * @param {string|null} [options.editTitle]
 * @param {string|null} [options.editBaseUrl]
 * @param {string|null} [options.nestedEditUrl]
 * @param {string|null} [options.nestedEditParams]
 * @param {Object|null} [options.actions]
 *
 * @returns {void}
 */

export function openSidePanel({
  title,
  content,
  entityId,
  editTitle = null,
  editBaseUrl = null,
  nestedEditUrl = null,
  nestedEditParams = null,
  actions = null,
}) {
  panelTitle.textContent = title;
  panelContent.innerHTML = content;

  panel.classList.add("open");
  document.body.classList.add("side-panel-open");

  // Accessibilité
  panel.setAttribute("aria-hidden", "false");
  panelToggle?.setAttribute("aria-expanded", "true");

  currentEntityId = entityId;

  // ==================================================
  // ACTIONS VISIBILITY
  // ==================================================

  const hasError = panelContent.querySelector("[data-panel-error]");
  if (panelActions) {
    panelActions.style.display = hasError || !actions ? "none" : "flex";
  }

  // ==================================================
  // DELETE ACTION CONFIG
  // ==================================================

  const deleteBtn = panel.querySelector("[data-panel-action='delete']");
  if (deleteBtn && actions?.delete) {
    deleteBtn.dataset.deleteUrl = actions.delete.url;
    deleteBtn.dataset.rowSelector = actions.delete.rowSelector;
    deleteBtn.dataset.confirmMessage = actions.delete.confirmMessage;
    deleteBtn.dataset.entityType = actions.delete.type;
  }

  // ==================================================
  // EDIT ACTION CONFIG
  // ==================================================

  const editBtn = panel.querySelector("[data-panel-action='edit']");
  if (editBtn) {
    // Gestion du titre
    if (editTitle) {
      editBtn.title = editTitle
    }

    // Cas 1 : Édition imbriquée
    if (nestedEditUrl && nestedEditParams) {
      editBtn.dataset.nestedEditUrl = nestedEditUrl;
      editBtn.dataset.nestedEditParams = nestedEditParams;
      editBtn.style.display = "inline-flex";

      delete editBtn.dataset.editBase;

    // Cas 2 : Édition simple  
    } else if (editBaseUrl) {
      editBtn.dataset.editBase = editBaseUrl;
      editBtn.style.display = "inline-flex";

      delete editBtn.dataset.nestedEditUrl;
      delete editBtn.dataset.nestedEditParams;

    // Cas 3 : Aucune édition possible
    } else {
      editBtn.style.display = "none";
    }
  }

  // ==================================================
  // ACCESSIBILITY
  // ==================================================

  panel.focus({ preventScroll: true });

  focusTrap.activate({
    autoFocus: isKeyboardInteraction()
  });

  escapeManager.register({
    id: "side-panel",
    close: closeSidePanel
  })
}

/**
 * CLOSE PANEL
 * =========================================================================================
 * Ferme le side panel et réinitialise son état.
 *
 * @function closeSidePanel
 * 
 * @returns {void}
 */

export function closeSidePanel() {
  panel.classList.remove("open");
  document.body.classList.remove("side-panel-open");

  // Accessibilité
  panel.setAttribute("aria-hidden", "true");
  panelToggle?.setAttribute("aria-expanded", "false");

  panelContent.innerHTML = "";
  currentEntityId = null;

  document
  .querySelectorAll(".js-panel-row.is-active")
  .forEach(row => row.classList.remove("is-active"));

  // Gestion Escape & focus
  focusTrap.deactivate();
  escapeManager.unregister("side-panel");
}

// ==================================================
// STATE HELPERS
// ==================================================

/**
 * SIDE PANEL IS OPEN ?
 * =========================================================================================
 * Indique si le side panel est actuellement ouvert.
 *
 * @function isSidePanelOpen
 * 
 * @returns {boolean}
 */

export function isSidePanelOpen() {
  return panel.classList.contains("open");
}

/**
 * CURRENT DISPLAY ENTITY ID
 * =========================================================================================
 * Retourne l'identifiant de l'entité actuellement affichée.
 *
 * @function getCurrentEntityId
 * 
 * @returns {string|null}
 */

export function getCurrentEntityId() {
  return currentEntityId;
}

// ==================================================
// UI EVENTS
// ==================================================

panelToggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeSidePanel();
});

panel?.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", () => {
  if (!isSidePanelOpen()) return;
  closeSidePanel();
});