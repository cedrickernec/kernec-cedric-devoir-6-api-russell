/**
 * ===================================================================
 * AJAX CONTROLLER - RESERVATIONS
 * ===================================================================
 * - Validation asynchrone formulaire
 * - Suppression multiple via AJAX
 * ===================================================================
 */

import {
  checkBulkReservationDelete,
  deleteBulkReservations
} from "../../gateways/api/reservationApi.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

// ==================================================
// CHECK BULK RESERVATION
// ==================================================

export async function checkBulkReservationDeleteAjax(req, res) {
  try {
    const result = await checkBulkReservationDelete(req.body, req, res);
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

export const deleteReservations = async (req, res) => {
  try {
    const apiResponse = await deleteBulkReservations(req.body, req, res);

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