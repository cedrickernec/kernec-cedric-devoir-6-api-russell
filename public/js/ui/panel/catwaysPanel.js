/**
 * ===================================================================
 * CATWAYS PANEL CONFIGURATION
 * ===================================================================
 * - Configure le side panel pour l'entité Catway
 * - Définit les routes panel / édition / suppression
 * - Centralise les messages spécifiques métier
 * ===================================================================
 */

import { initEntityPanel } from "./entityPanel.js";
import { CATWAY_MESSAGES } from "../../messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

// ==================================================
// PANEL INITIALISATION
// ==================================================

initEntityPanel({
  panelTitle: "Détails",
  panelUrl: "/catways",

  editTitle: "Éditer le catway",
  editBaseUrl: "/catways",

  deleteConfig: {
    deleteUrlTemplate: "/catways/:catwayNumber",
    confirmMessage: CATWAY_MESSAGES.DELETE_CONFIRM,
    type: "catway"
  },

  messages: {
    NOT_FOUND: CATWAY_MESSAGES.NOT_FOUND,
    SERVER_ERROR_SHORT: COMMON_MESSAGES.SERVER_ERROR_SHORT,
    SERVER_ERROR_LONG: COMMON_MESSAGES.SERVER_ERROR_LONG
  }
});