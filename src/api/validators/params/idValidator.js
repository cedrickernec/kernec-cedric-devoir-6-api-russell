/**
 * ===================================================================
 * ID VALIDATOR
 * ===================================================================
 * - Empêche les identifiants invalide d'atteindre les services :
 *    - Valide les identifiant transmis dans les routes
 * ===================================================================
 */

import mongoose from "mongoose";
import { ApiError } from "../../utils/errors/apiError.js";

// ===============================================
// VALIDATE CATWAY NUMBER
// ===============================================
export function validateCatwayNumber(catwayNumber) {

  if (isNaN(catwayNumber)) {
    throw new ApiError(400, "Numéro de catway invalide.");
  }

  return Number(catwayNumber);
}

// ===============================================
// VALIDATE MONGODB OBJECT ID
// ===============================================
export function validateObjectId(id, label = "Identifiant") {
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${label} invalide.`);
  }

  return id;
}