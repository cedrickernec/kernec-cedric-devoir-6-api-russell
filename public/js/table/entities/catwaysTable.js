/**
 * ===================================================================
 * CATWAYS TABLE
 * ===================================================================
 * - Initialise la table Catways
 * - Configure la sélection multiple
 * - Configure la suppression en masse
 * - Fournit les messages spécifiques aux catways
 * - Repose sur entityTable et tableCore
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
        deleteUrl: "/catways/",
        deleteType: "catway",

        messages: {
            success: CATWAY_MESSAGES.BULK_DELETE_SUCCESS,
            cancelled: COMMON_MESSAGES.DELETE_CANCEL,
            error: COMMON_MESSAGES.DELETE_ERROR,
        }
    });
}