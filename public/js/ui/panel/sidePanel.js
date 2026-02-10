/**
 * ===================================================================
 * SIDE PANEL INTERFACE CONTROLLER
 * ===================================================================
 * - Gère l'ouverture / fermeture du side panel
 * - Injecte dynamiquement le contenu et les actions
 * - Expose des helpers d'état
 * ===================================================================
 */

import { escapeManager } from "../accessibility/escapeManager.js";
import { createFocusTrap } from "../accessibility/focusTrap.js";
import { isKeyboardInteraction } from "../accessibility/interactionMode.js";

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
let currentActions = null;

// ==================================================
// PANEL OPEN
// ==================================================

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
  currentActions = actions;

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

  // Gestion Escape & focus
  panel.focus({ preventScroll: true });

  focusTrap.activate({
    autoFocus: isKeyboardInteraction()
  });

  escapeManager.register({
    id: "side-panel",
    close: closeSidePanel
  })
}

// ==================================================
// PANEL CLOSE
// ==================================================

export function closeSidePanel() {
  panel.classList.remove("open");
  document.body.classList.remove("side-panel-open");

  // Accessibilité
  panel.setAttribute("aria-hidden", "true");
  panelToggle?.setAttribute("aria-expanded", "false");

  panelContent.innerHTML = "";
  currentEntityId = null;
  currentActions = null;

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

export function isSidePanelOpen() {
  return panel.classList.contains("open");
}

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