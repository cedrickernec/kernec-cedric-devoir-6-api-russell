/**
 * AJAX CONTROLLER - CATWAYS
 * =========================================================================================
 * - Validation asynchrone formulaire
 * - Suppression multiple via AJAX
 */

import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import {
  checkCatwayNumber,
  deleteBulkCatways,
  checkBulkCatwayDelete
} from "../../gateways/api/catwayApi.js";
import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

/**
 * CHECK - CATWAY NUMBER AVAILABILITY
 * =========================================================================================
 * Vérifie la disponibilité d'un numéro de catway via AJAX.
 *
 * @async
 * @function checkCatwayNumberAvailability
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Promise<void>}
 */

export const checkCatwayNumberAvailability = async (req, res) => {
  try {
    const apiResponse = await checkCatwayNumber(req.query, req, res);
    res.json(apiResponse);
  } catch (error) {
    console.error("Erreur check catway number:", error);
    res.status(500).json({ available: false });
  }
};

/**
 * CHECK BULK CATWAY
 * =========================================================================================
 * Vérifie si une suppression multiple de catways nécessite une confirmation.
 *
 * - Appelle l'API de "bulk-check"
 * - Retourne directement le résultat au format JSON
 *
 * @async
 * @function checkBulkCatwayDeleteAjax
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Promise<void>}
 */

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

/**
 * BULK DELETE - TABLE
 * =========================================================================================
 * Supprime plusieurs catways via AJAX.
 *
 * - Appelle l'API de suppression bulk
 * - Retourne 409 si conflit (ex: password_required)
 * - Retourne le résultat JSON de l'API
 *
 * @async
 * @function deleteCatways
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Promise<void>}
 */

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