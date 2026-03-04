/**
 * DOC BOOTSTRAP
 * =========================================================================================
 * @module docBootstrap
 *
 * Point d'entrée de l'interface de documentation API.
 *
 * - Active les mécanismes d'accessibilité
 * - Synchronise la session utilisateur entre onglets
 * - Initialise la navigation du menu documentation
 */

// ACCESSIBILITY
import "../ui/accessibility/interactionMode.js";
import "../ui/accessibility/escapeManager.js";

// SESSION
import "../auth/loginSync.js";
import "../auth/logoutSync.js";
import "../session/sessionController.js";

// NAVIGATION
import "../ui/navigation/docMenu.js";