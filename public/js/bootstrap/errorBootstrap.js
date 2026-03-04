/**
 * ERROR BOOTSTRAP
 * =========================================================================================
 * @module errorBootstrap
 *
 * Point d'entrée minimal pour les pages d'erreur.
 *
 * - Active les mécanismes d'accessibilité essentiels
 * - Maintient la synchronisation de session entre onglets
 */

// ACCESSIBILITY
import "../ui/accessibility/interactionMode.js";

// SESSION
import "../auth/loginSync.js";
import "../auth/logoutSync.js";
import "../session/sessionController.js";