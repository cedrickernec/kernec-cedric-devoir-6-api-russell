/**
 * AJAX CONTROLLER - RESERVATIONS
 * =========================================================================================
 * - Validation asynchrone formulaire
 * - Suppression multiple via AJAX
 */

import {
  checkBulkReservationDelete,
  deleteBulkReservations
} from "../../gateways/api/reservationApi.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

/**
 * CHECK BULK RESERVATION
 * =========================================================================================
 * Vérifie si une suppression multiple de réservations nécessite une confirmation.
 *
 * - Appelle l'API de "bulk-check"
 * - Retourne directement le résultat au format JSON
 *
 * @async
 * @function checkBulkReservationDeleteAjax
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Promise<void>}
 */

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

/**
 * BULK DELETE - TABLE
 * =========================================================================================
 * Supprime plusieurs réservations via AJAX.
 *
 * - Appelle l'API de suppression bulk
 * - Retourne 409 si conflit (ex: password_required)
 * - Retourne le résultat JSON de l'API
 *
 * @async
 * @function deleteReservations
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Promise<void>}
 */

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