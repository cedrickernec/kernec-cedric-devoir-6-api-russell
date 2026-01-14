/**
 * ===================================================================
 * RESERVATIONS AJAX CONTROLLER
 * ===================================================================
 * - Suppression AJAX (table & panel)
 * ===================================================================
 */

import Reservation from "../../../api/models/Reservation.js";
import { RESERVATION_MESSAGES } from "../../../../public/js/messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

// ==================================================
// BULK DELETE - TABLE
// ==================================================

export const deleteReservations = async (req, res) => {
  try {
    const { ids } = req.body;

    // Sécurité payload
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: COMMON_MESSAGES.INVALID_REQUEST });
    }

    await Reservation.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      count: ids.length
    });

  } catch (error) {
    console.error("Suppression échouée :", error);
    res.status(500).json({ success: false });
  }
};

// ==================================================
// DELETE - SIDE PANEL
// ==================================================

export const deleteReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteReservation = await Reservation.findByIdAndDelete(id);

    if (!deleteReservation) {
      return res.status(404).json({
        success: false,
        message: RESERVATION_MESSAGES.NOT_FOUND
      });
    }

    res.status(204).end();

  } catch (error) {
    console.error("Suppression utilisateur :", error);
    res.status(500).json({ success: false });
  }
};