/**
 * ===================================================================
 * APP BOOTSTRAP
 * ===================================================================
 * - Initialisation globale de l'application interne (pages privées)
 * ===================================================================
 */

// ACCESSIBILITY
import "../ui/accessibility/interactionMode.js";
import "../ui/accessibility/escapeManager.js";
import "../ui/accessibility/focusTrap.js";

// SESSION
import "../session/sessionController.js";

// UI GLOBAL
import "../ui/modal/confirmModal.js";
import "../ui/panel/sidePanel.js";
import "../controller/selectionController.js";

// UI FEEDBACK
import "../ui/toast/toast.js";
import "../ui/tooltip/tooltip.js";

// WIDGETS GLOBAUX
import "../ui/widget/sidebarClock.js";