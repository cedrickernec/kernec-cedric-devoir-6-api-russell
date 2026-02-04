/**
 * ===================================================================
 * RESERVATIONS AJAX CONTROLLER
 * ===================================================================
 * - Suppression AJAX (table & panel)
 * ===================================================================
 */

import { deleteReservation } from "../../services/api/reservationApi.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

// ==================================================
// BULK DELETE - TABLE
// ==================================================

export const deleteReservations = async (req, res) => {
  try {
    const { ids } = req.body;

    // Sécurité payload
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: COMMON_MESSAGES.INVALID_REQUEST
      });
    }

    for (const compositeId of ids) {
      const [catwayNumber, reservationId] = compositeId.split("|");

      const apiResponse = await deleteReservation(catwayNumber, reservationId, req, res);

      if (handleAuthExpired(apiResponse, req, res)) return;

      if (apiResponse.success === false) {
        return res.status(500).json({
          success: false,
          message: apiResponse.message
        });
      }
    }

    res.json({
      success: true,
      count: ids.length
    });

  } catch (error) {
    console.error("Suppression échouée :", error);
    res.status(500).json({ success: false });
  }
};