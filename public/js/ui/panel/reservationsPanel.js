/**
 * ===================================================================
 * RESERVATIONS PANEL
 * ===================================================================
 * - Configuration du panneau latéral de l'entité reservations
 * ===================================================================
 */

import { initEntityPanel } from "./entityPanel.js";
import { RESERVATION_MESSAGES } from "../../messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

initEntityPanel({
  panelTitle: "Détail de la réservation",
  nestedPanelUrl: "/catways/:catwayNumber/reservations/:id/panel",
  nestedParams: (row) => ({
    catwayNumber: row.dataset.catway
  }),

  editTitle: "Éditer la réservation",
  editBaseUrl: "/reservations",
  nestedEditUrl: "/catways/:catwayNumber/reservations/:id/edit",
  nestedEditParams: (row) => ({
    catwayNumber: row.dataset.catway
  }),
  

  deleteConfig: {
    baseUrl: "/reservations/ajax",
    confirmMessage: RESERVATION_MESSAGES.DELETE_CONFIRM,
    type: "reservation"
  },

  messages: {
    NOT_FOUND: RESERVATION_MESSAGES.NOT_FOUND,
    SERVER_ERROR_SHORT: COMMON_MESSAGES.SERVER_ERROR_SHORT,
    SERVER_ERROR_LONG: COMMON_MESSAGES.SERVER_ERROR_LONG
  }
});