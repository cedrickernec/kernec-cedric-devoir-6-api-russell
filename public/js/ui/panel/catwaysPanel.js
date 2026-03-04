/**
 * CATWAYS PANEL CONFIGURATION
 * =========================================================================================
 * @module catwaysPanel
 * 
 * Configuration du side panel pour l'entité Catway.
 *
 * Responsabilités :
 * - Définir les routes de chargement du panel
 * - Configurer les routes d'édition
 * - Configurer la suppression
 * - Centraliser les messages métier spécifiques
 *
 * Architecture :
 * → Adaptateur métier au-dessus du contrôleur générique initEntityPanel
 */

import { initEntityPanel } from "./entityPanel.js";
import { CATWAY_MESSAGES } from "../../messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

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