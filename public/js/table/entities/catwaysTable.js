/**
 * CATWAYS TABLE MODULE
 * =========================================================================================
 * @module catwaysTable
 *
 * Configure la table des catways à partir du moteur générique entityTable.
 *
 * Rôle :
 * - Activer la sélection multiple
 * - Activer la suppression en masse
 * - Injecter les messages métier spécifiques aux catways
 *
 * Ce module ne contient aucune logique métier :
 * il se contente de fournir une configuration adaptée.
 */

import { initEntityTable } from "../core/entityTable.js";
import { CATWAY_MESSAGES } from "../../messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

/**
 * CATWAYS TABLE INITIALISATION
 * =========================================================================================
 * Initialise la table des catways avec sa configuration spécifique.
 *
 * @function initCatwaysTable
 * 
 * @returns {void}
 */

export function initCatwaysTable() {
    initEntityTable({
        tableSelector: ".data-table",
        checkboxName: "selectedCatways",
        deleteBtnId: "delete-selected",
        selectAllId: "select-all",

        checkUrl: "/ajax/catways/bulk-check",
        bulkUrl: "/ajax/catways/bulk",
        deleteType: "catway",

        messages: {
            success: CATWAY_MESSAGES.BULK_DELETE_SUCCESS,
            cancelled: COMMON_MESSAGES.DELETE_CANCEL,
            error: COMMON_MESSAGES.DELETE_ERROR,
        }
    });
}