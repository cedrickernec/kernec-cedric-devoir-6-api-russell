/**
 * ===================================================================
 * TOAST NOTIFICATION SYSTEM
 * ===================================================================
 * - Affiche des notifications temporaires
 * - Supporte les actions personnalisées
 * - Pause au survol
 * ===================================================================
 */

(function () {

  const container = document.getElementById("toast-container");
  if (!container) return;

  // ==================================================
  // GLOBAL CONFIG
  // ==================================================

  const DEFAULT_DURATION = 5000;

  /**
   * Afficher une notification toast
   * @param {"success"|"error"|"info"} type
   * @param {string} message
   * @param {Object} [options]
   * @param {number} [options.duration]
   * @param {Object} [options.action]
   * @param {string} options.action.label
   * @param {Function} options.action.onClick
   */
  window.showToast = function (type, message, options = {}) {
    const duration = options.duration ?? DEFAULT_DURATION;

    // ==================================================
    // TOAST CREATION
    // ==================================================

    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;

    const messageEl = document.createElement("div");
    messageEl.className = "toast-message";
    messageEl.textContent = message;

    const actionsEl = document.createElement("div");
    actionsEl.className = "toast-actions";

    // ==================================================
    // CUSTOM ACTION
    // ==================================================

    if (options.action?.label && typeof options.action.onClick === "function") {
      const actionBtn = document.createElement("button");
      actionBtn.textContent = options.action.label;

      actionBtn.addEventListener("click", () => {
        options.action.onClick();
        removeToast();
      });

      actionsEl.appendChild(actionBtn);
    }

    // ==================================================
    // CLOSE BUTTON
    // ==================================================

    const closeBtn =
    document.createElement("button");
    closeBtn.className = "btn btn-close"
    closeBtn.setAttribute("aria-label", "Fermer la notification")

    const icon =
    document.createElement("i");
    icon.className = "fa-solid fa-xmark"
    icon.setAttribute("aria-hidden", "true")

    closeBtn.appendChild(icon);
    closeBtn.addEventListener("click", removeToast);
    actionsEl.appendChild(closeBtn);

    // ==================================================
    // DOM ASSEMBLY
    // ==================================================

    toast.appendChild(messageEl);
    toast.appendChild(actionsEl);
    container.appendChild(toast);

    // ==================================================
    // TIMER MANAGEMENT (PAUSE ON HOVER)
    // ==================================================

    let remainingTime = duration;
    let startTime = Date.now();
    let timeoutId = setTimeout(removeToast, remainingTime);
    let isClosing = false;

    toast.addEventListener("mouseenter", () => {
      clearTimeout(timeoutId);
      remainingTime -= Date.now() - startTime;
    });

    toast.addEventListener("mouseleave", () => {
      startTime = Date.now();
      timeoutId = setTimeout(removeToast, remainingTime);
    });

    // ==================================================
    // TOAST REMOVAL
    // ==================================================

    function removeToast() {
      if (isClosing) return;
      isClosing = true;

      clearTimeout(timeoutId);
      toast.classList.add("toast--closing");

      toast.addEventListener(
        "animationend",
        () => toast.remove(),
        { once: true }
      );
    }
  };
})();