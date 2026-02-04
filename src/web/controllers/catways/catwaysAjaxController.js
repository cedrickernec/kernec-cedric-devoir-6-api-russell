/**
 * --------------------------------------------------------------------
 * Controlleur AJAX - Catways
 * --------------------------------------------------------------------
 * - Validation asynchrone (formulaires)
 * - Suppression AJAX (table & panel)
 */

import Catway from "../../../api/models/Catway.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { deleteCatway } from "../../services/api/catwayApi.js";
import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

// ==================================================
// CHECK - CATWAY NUMBER AVAILABILITY
// ==================================================

export const checkCatwayNumberAvailability = async (req, res) => {
  try {
    const { number, excludeId } = req.query;

    // Validation minimale
    if (!number) return res.json({ available: false});

    const catwayNumberInt = Number(number);
    if (Number.isNaN(catwayNumberInt))
      return res.json({ available: false });

    // Requête dynamique
    const query = { catwayNumber: catwayNumberInt };
    if (excludeId) query._id = {
      $ne: excludeId
    };

    const existing = await Catway.findOne(query);

    res.json({ available: !existing });

  } catch (error) {
    console.error("Erreur check catway number:", error);
    res.status(500).json({ available: false });
  }
};

// ==================================================
// BULK DELETE - TABLE
// ==================================================

export const deleteCatways = async (req, res) => {
  try {
    const { ids } = req.body;

    // Sécurité payload
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: COMMON_MESSAGES.INVALID_REQUEST
      });
    }

    for (const catwayNumber of ids) {
      const apiResponse = await deleteCatway(catwayNumber, req, res);

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