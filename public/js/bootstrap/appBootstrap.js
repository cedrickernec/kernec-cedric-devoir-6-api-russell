/**
 * APP BOOTSTRAP
 * =========================================================================================
 * @module appBootstrap
 * Point d'entrée principale de l'application interne.
 * 
 * - Charge les modules globaux
 * - Initialise les contrôleurs UI
 * - Active les synchronisations de session
 */

// ACCESSIBILITY
import "../ui/accessibility/interactionMode.js";
import "../ui/accessibility/escapeManager.js";
import "../ui/accessibility/focusTrap.js";

// SESSION
import "../auth/loginSync.js";
import "../auth/logoutSync.js";
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