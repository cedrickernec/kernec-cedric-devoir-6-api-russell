/**
 * ===================================================================
 * AJAX CONTROLLER - CATWAYS
 * ===================================================================
 * - Validation asynchrone formulaire
 * - Suppression multiple via AJAX
 * ===================================================================
 */

import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import {
  checkCatwayNumber,
  deleteBulkCatways,
  checkBulkCatwayDelete
} from "../../gateways/api/catwayApi.js";
import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

// ==================================================
// CHECK - CATWAY NUMBER AVAILABILITY
// ==================================================

export const checkCatwayNumberAvailability = async (req, res) => {
  try {
    const apiResponse = await checkCatwayNumber(req.query, req, res);
    res.json(apiResponse);
  } catch (error) {
    console.error("Erreur check catway number:", error);
    res.status(500).json({ available: false });
  }
};

// ==================================================
// CHECK BULK CATWAY
// ==================================================

export async function checkBulkCatwayDeleteAjax(req, res) {
  try {
    const result = await checkBulkCatwayDelete(req.body, req, res);
    res.json(result);
  } catch (err) {
    console.error("Bulk check error:", err);
    res.status(500).json({
      success: false,
      message: "Erreur serveur lors de la vérification"
    });
  }
}

// ==================================================
// BULK DELETE - TABLE
// ==================================================

export const deleteCatways = async (req, res) => {
  try {
    const apiResponse = await deleteBulkCatways(req.body, req, res);

    if (handleAuthExpired(apiResponse, req, res)) return;

    if (apiResponse.success === false) {
      return res.status(409).json(apiResponse);
    }

    res.json(apiResponse);

  } catch (error) {
    console.error("Suppression bulk échouée :", error);
    res.status(500).json({
      success: false,
      message: COMMON_MESSAGES.DELETE_ERROR
    });
  }
};