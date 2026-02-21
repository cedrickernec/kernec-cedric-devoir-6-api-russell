/**
 * ===================================================================
 * VIEW MAPPER - USERS
 * ===================================================================
 * - Transforme les données API en ViewModels utilisables par les vues
 * - Centralise le formatage des dates et valeurs fallback
 * - Évite toute logique de présentation dans les contrôleurs
 * ===================================================================
*/

import { formatDateFR } from "../formatters/dateFormatter.js";

// ==================================================
// MAPPER - USER LIST (TABLE)
// ==================================================

export function mapUserToList(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

// ==================================================
// MAPPER - USER DETAIL
// ==================================================

export function mapUserDetail(user) {
  if (!user) {
    return {
      id: null,
      username: "-",
      email: "-",
      createdAtFormatted: "Non disponible",
      updatedAtFormatted: "Non disponible"
    };
  }

  const createdAt =
  user.createdAt
    ? new Date(user.createdAt)
    : null;

  const updatedAt =
  user.updatedAt
    ? new Date(user.updatedAt)
    : null;

  return {
    id: user.id,

    username: user.username ?? "-",
    email: user.email ?? "-",

    createdAtFormatted: formatDateFR(createdAt),
    updatedAtFormatted: formatDateFR(updatedAt)
  };
}

// ==================================================
// MAPPER - USER FORM
// ==================================================

export function mapUserToForm(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}