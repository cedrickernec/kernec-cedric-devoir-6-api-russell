/**
 * ===================================================================
 * USERS PANEL
 * ===================================================================
 * - Configuration du panneau latéral de l'entité users
 * ===================================================================
 */

import { initEntityPanel } from "./entityPanel.js";
import { USER_MESSAGES } from "../../messages/userMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

initEntityPanel({
  panelTitle: "Détail utilisateur",
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