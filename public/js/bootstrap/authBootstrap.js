/**
 * AUTH BOOTSTRAP
 * =========================================================================================
 * @module authBootstrap
 *
 * Point d'entrée minimal pour les pages d'authentification.
 *
 * - Active les mécanismes d'accessibilité de base
 * - Synchronise la session entre onglets (login / logout)
 * - Initialise les helpers de formulaire (erreurs, visibilité mot de passe)
 */

// ACCESSIBILITY
import "../ui/accessibility/interactionMode.js";

// SESSION
import "../auth/loginSync.js";
import "../auth/logoutSync.js";
import "../session/sessionController.js";

// FORM HELPERS
import "../ui/form/formErrorCleanup.js";
import "../ui/form/passwordEye.js";