/**
 * --------------------------------------------------------------------
 * Controlleur AJAX - Users
 * --------------------------------------------------------------------
 * - Validation asynchrone (email uniquement)
 * - Suppression AJAX (table & panel)
 */

import User from "../../../api/models/User.js";
import { USER_MESSAGES } from "../../../../public/js/messages/userMessages.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";
import mongoose from "mongoose";

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
  try {
    const { ids } = req.body;

    // Sécurité payload
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: COMMON_MESSAGES.INVALID_REQUEST });
    }

    await User.deleteMany({ _id: { $in: ids } });

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

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);

    if (!deleteUser) {
      return res.status(404).json({
        success: false,
        message: USER_MESSAGES.NOT_FOUND
      });
    }

    res.status(204).end();

  } catch (error) {
    console.error("Suppression utilisateur :", error);
    res.status(500).json({ success: false });
  }
};