/**
 * ===================================================================
 * CATWAYS TABLE INITIALISER
 * ===================================================================
 * - Configure et initialise la table des catways
 * - Active la sélection multiple
 * - Active la suppression en masse (bulk delete)
 * - Injecte les messages métier spécifique aux catways
 * ===================================================================
 * Architecture :
 * → Adaptateur métier au-dessus du moteur générique entityTable
 * ===================================================================
 */

import { initEntityTable } from "../core/entityTable.js";
import { CATWAY_MESSAGES } from "../../messages/catwayMessages.js";
import { COMMON_MESSAGES } from "../../messages/commonMessages.js";

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