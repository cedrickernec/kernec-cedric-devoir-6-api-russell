/**
 * ===================================================================
 * GLOBAL CONFIRM MODAL CONTROLLER
 * ===================================================================
 * - Contrôle l'affichage de la modale de confirmation globale
 * - Expose window.openConfirmModal(options)
 * - Gère :
 *      → injection dynamique du contenu
 *      → callbacks async de confirmation
 *      → fermeture (Escape / backdrop / boutons)
 *      → accessibilité (focus trap + interaction mode)
 * ===================================================================
 */
import { escapeManager } from "../accessibility/escapeManager.js";
import { createFocusTrap } from "../accessibility/focusTrap.js";
import { isKeyboardInteraction } from "../accessibility/interactionMode.js";

(function () {

  // ==================================================
  // MODAL INITIALISATION
  // ==================================================

  const modal = document.getElementById("confirm-modal");
  if (!modal) return;

  const focusTrap = createFocusTrap(modal);

  const titleEl = document.getElementById("confirm-title");
  const messageEl = document.getElementById("confirm-message");
  const cancelBtn = document.getElementById("btn-modal-cancel");
  const confirmBtn = document.getElementById("btn-modal-confirm");
  const closeBtn = document.getElementById("btn-modal-close");
  const backdrop = modal.querySelector(".modal-backdrop");
  const confirmLabelDefaut = confirmBtn?.textContent || "Confirmer";

  // ==================================================
  // INTERNAL STATE
  // ==================================================

  let onConfirmCallback = null;
  let onCancelCallback = null;

  // ==================================================
  // OPEN MODAL
  // ==================================================

  function open({ title = "Confirmation", content, onConfirm, onCancel }) {
    if (titleEl) titleEl.textContent = title;

    if (messageEl) {
      messageEl.innerHTML = "";
      if (!(content instanceof Node)) {
        throw new Error("confirmModal : Le contenu doit être un DOM Node");
      }
      messageEl.appendChild(content);
    }

    if (confirmBtn) {
      confirmBtn.textContent = "Confirmer";
    }

    onConfirmCallback = typeof onConfirm === "function" ? onConfirm : null;
    onCancelCallback = typeof onCancel === "function" ? onCancel : null;

    modal.classList.remove("hidden");

    // Gestion Escape & focus
    const dialog = modal.querySelector(".modal-content");
    dialog?.focus({ preventScroll: true });

    focusTrap.activate({
      autoFocus: isKeyboardInteraction()
    });

    escapeManager.register({
      id: "confirm-modal",
      close: cancel
    });
  }

  // ==================================================
  // CLOSE MODAL
  // ==================================================

  function close() {
    if (confirmBtn) {
      confirmBtn.textContent = confirmLabelDefaut;
    }
    
    modal.classList.add("hidden");
    onConfirmCallback = null;
    onCancelCallback = null;

    focusTrap.deactivate();
    escapeManager.unregister("confirm-modal");
  }

  function cancel() {
    try {
      if (onCancelCallback) onCancelCallback();
    } finally {
      close();
    }
  }

  window.openConfirmModal = function (options) {
    open(options || {});
  };

  // ==================================================
  // CONFIRM ACTION HANDLER
  // ==================================================
  
  confirmBtn?.addEventListener("click", async () => {

      if (!onConfirmCallback) {
        close();
        return;
      }

      try {
        const shouldClose = await onConfirmCallback();
        if (shouldClose === false) {
          return;
        }

        close();

      } catch (err) {
        if(err?.code === "PASSWORD_INVALID") {

          const passwordField = modal.querySelector("#password-confirm");
          if (passwordField) {
            passwordField.setAttribute("data-invalid", "true");
            passwordField.focus();
            passwordField.select?.();

            return;
          }

          console.error(err);
        }
      }
  });

  cancelBtn?.addEventListener("click", cancel);
  closeBtn?.addEventListener("click", cancel);
  backdrop?.addEventListener("click", cancel);

})();