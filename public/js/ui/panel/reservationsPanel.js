/**
 * RESERVATIONS PANEL CONFIGURATION
 * =========================================================================================
 * @module reservationsPanel
 * 
 * Configuration du side panel pour l'entité Reservation.
 *
 * Spécificités :
 * - Support des routes imbriquées Catway → Reservation
 * - Configuration des routes panel / edit / delete
 * - Centralisation des messages métier
 *
 * Architecture :
 * → Adaptateur métier au-dessus de initEntityPanel
 */

import { initEntityPanel } from "./entityPanel.js";
import { RESERVATION_MESSAGES } from "../../messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

initEntityPanel({
  panelTitle: "Détails",
  nestedPanelUrl: "/catways/:catwayNumber/reservations/:id/panel",
  nestedParams: (row) => ({
    catwayNumber: row.dataset.catwayNumber
  }),

  editTitle: "Éditer la réservation",
  editBaseUrl: "/reservations",
  nestedEditUrl: "/catways/:catwayNumber/reservations/:id/edit",
  nestedEditParams: (row) => ({
    catwayNumber: row.dataset.catwayNumber
  }),
  
  deleteConfig: {
    deleteUrlTemplate: "/catways/:catwayNumber/reservations/:id",
    confirmMessage: RESERVATION_MESSAGES.DELETE_CONFIRM,
    type: "reservation"
  },

  messages: {
    NOT_FOUND: RESERVATION_MESSAGES.NOT_FOUND,
    SERVER_ERROR_SHORT: COMMON_MESSAGES.SERVER_ERROR_SHORT,
    SERVER_ERROR_LONG: COMMON_MESSAGES.SERVER_ERROR_LONG
  }
});