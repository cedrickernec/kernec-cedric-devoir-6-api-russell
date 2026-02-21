/**
 * ===================================================================
 * FOCUS TRAP UTILITY
 * ===================================================================
 * - Bloque la navigation clavier à l'intérieur du conteneur
 * - Empêche le focus de sortir
 * - Restaure le focus précédent à la fermeture
 * ===================================================================
 */

export function createFocusTrap(container) {

  // ==================================================
  // FOCUSABLE SELECTORS
  // ==================================================

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

  // ==================================================
  // HELPERS
  // ==================================================

  function getFocusableElements() {
    return Array.from(
      container.querySelectorAll(selectors.join(","))
    );
  }

  // ==================================================
  // TAB NAVIGATION CONTROL
  // ==================================================

  function handleKeydown(e) {
    if (e.key !== "Tab") return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Shift + Tab → boucle vers la fin
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();

    // Tab → boucle vers le début
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // ==================================================
  // PUBLIC API
  // ==================================================

  return {

    // Active le piège de focus
    activate({ autoFocus = true }) {
      previousFocus = document.activeElement;
      focusables = getFocusableElements();

      if (autoFocus && focusables.length) {
        focusables[0].focus();
      }

      document.addEventListener("keydown", handleKeydown, true);
    },

    // Désactive le piège et restaure le focus initial
    deactivate() {
      document.removeEventListener("keydown", handleKeydown, true);
      previousFocus?.focus();
    }
  };
}