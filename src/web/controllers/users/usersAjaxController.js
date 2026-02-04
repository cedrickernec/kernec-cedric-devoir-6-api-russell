/**
 * --------------------------------------------------------------------
 * Controlleur AJAX - Users
 * --------------------------------------------------------------------
 * - Validation asynchrone (email uniquement)
 * - Suppression AJAX (table & panel)
 */

import User from "../../../api/models/User.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import mongoose from "mongoose";
import { deleteUser } from "../../services/api/userApi.js";
import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

// ==================================================
// CHECK - EMAIL AVAILABILITY
// ==================================================

export const checkEmailAvailability = async (req, res) => {
  try {
    const { email, excludeId } = req.query;

    // Validation minimale
    if (!email) {
      return res.json({ available: false });
    }

    // Requête dynamique
    const query = { email };
    if (
      excludeId &&
      excludeId !== "undefined" &&
      mongoose.Types.ObjectId.isValid(excludeId)) {
      query._id = { $ne: excludeId };
    }

    const existingUser = await User.findOne(query);

    res.json({ available: !existingUser });

  } catch (error) {
    console.error("Erreur vérification email :", error);
    res.status(500).json({ available: false });
  }
};

// ==================================================
// BULK DELETE - TABLE
// ==================================================

export const deleteUsers = async (req, res) => {
  console.log(">>> DELETE BULK USERS HIT", {
    url: req.originalUrl,
    method: req.method,
    ids: req.body?.ids,
    accept: req.headers.accept,
    contentType: req.headers["content-type"]
  });

  try {
    const { ids } = req.body;

    console.log("IDS envoyées:", ids);
    // Sécurité payload
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: COMMON_MESSAGES.INVALID_REQUEST
      });
    }

    for (const id of ids) {
      const apiResponse = await deleteUser(id, req, res);

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