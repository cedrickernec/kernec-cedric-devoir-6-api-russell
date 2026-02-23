/**
 * ===================================================================
 * AJAX CONTROLLER - USERS
 * ===================================================================
 * - Validation asynchrone formulaire
 * - Suppression multiple via AJAX
 * ===================================================================
 */

import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import { fetchUsers, deleteUser } from "../../gateways/api/userApi.js";
import { handleAuthExpired } from "../../middlewares/auth/authExpiredHandler.js";

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
    const apiResponse = await fetchUsers(req, res);

    if (handleAuthExpired(apiResponse, req, res)) return;

    if (!apiResponse?.success) {
      return res.json({
        success: true,
        message: null,
        data: { available: false },
        status: 200
      });
    }

    const users = apiResponse.data || [];
    const exists = await users.some(user =>
      user.email === email && (!excludeId || user.id !== excludeId)
    );

    res.json({
      success: true,
      message: null,
      data: { available: !exists },
      status: 200
    });

  } catch (error) {
    console.error("Erreur vérification email :", error);
    res.status(500).json({
      success: false,
      message: "Erreur vérification email",
      data: { available: false },
      status: 500
    });
  }
};

// ==================================================
// BULK DELETE - TABLE
// ==================================================

export const deleteUsers = async (req, res) => {

  try {
    const { ids } = req.body;

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