/**
 * ===================================================================
 * MANAGING KEYBOARD FOCUS MOVEMENT WITHIN CONTAINER
 * ===================================================================
 * - Bloque la navigation clavier à l'intérieur du conteneur
 * - Empêche le focus de sortir
 * - Restaure le focus à la fermeture
 * ===================================================================
 */

export function createFocusTrap(container) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "textarea:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "[tabindex]:not([tabindex='-1'])"
  ];

  let previousFocus = null;
  let focusables = [];

  function getFocusableElements() {
    return Array.from(
      container.querySelectorAll(selectors.join(","))
    );
  }

  function handleKeydown(e) {
    if (e.key !== "Tab") return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return {
    activate({ autoFocus = true }) {
      previousFocus = document.activeElement;
      focusables = getFocusableElements();

      if (autoFocus && focusables.length) {
        focusables[0].focus();
      }

      document.addEventListener("keydown", handleKeydown, true);
    },

    deactivate() {
      document.removeEventListener("keydown", handleKeydown, true);
      previousFocus?.focus();
    }
  };
}