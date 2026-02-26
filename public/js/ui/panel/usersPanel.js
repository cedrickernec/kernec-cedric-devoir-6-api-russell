/**
 * USERS PANEL CONFIGURATION
 * =========================================================================================
 * @module usersPanel
 * 
 * Configuration du side panel pour l'entité User.
 *
 * Responsabilités :
 * - Définir les routes panel / édition / suppression
 * - Centraliser les messages spécifiques métier
 *
 * Architecture :
 * → Adaptateur métier au-dessus de initEntityPanel
 */

import { initEntityPanel } from "./entityPanel.js";
import { USER_MESSAGES } from "../../messages/userMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

initEntityPanel({
  panelTitle: "Détails",
  panelUrl: "/users",

  editTitle: "Éditer l'utilisateur",
  editBaseUrl: "/users",

  deleteConfig: {
    deleteUrlTemplate: "/users/:id",
    confirmMessage: USER_MESSAGES.DELETE_CONFIRM,
    type: "user"
  },

  messages: {
    NOT_FOUND: USER_MESSAGES.NOT_FOUND,
    SERVER_ERROR_SHORT: COMMON_MESSAGES.SERVER_ERROR_SHORT,
    SERVER_ERROR_LONG: COMMON_MESSAGES.SERVER_ERROR_LONG
  }
});