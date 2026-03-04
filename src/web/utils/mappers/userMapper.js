/**
 * VIEW MAPPER - USERS
 * =========================================================================================
 * @module userMapper
 *
 * Adaptateur API → ViewModel pour les utilisateurs.
 *
 * Responsabilités :
 * - Centraliser le formatage des dates
 * - Gérer les valeurs fallback
 * - Éviter toute logique UI dans les contrôleurs
 *
 * Dépendances :
 * - formatDateFR
 *
 * Effets de bord :
 * - Aucun
 */

import { formatDateFR } from "../formatters/dateFormatter.js";

/**
 * MAP USER TO LIST
 * =========================================================================================
 * Transforme un utilisateur API en modèle liste.
 *
 * @function mapUserToList
 *
 * @param {Object} user
 *
 * @returns {Object} - Modèle liste
 */

export function mapUserToList(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

/**
 * MAP USER DETAIL
 * =========================================================================================
 * Transforme un utilisateur API en modèle détail.
 *
 * - Gère les valeurs fallback
 * - Formate les dates
 *
 * @function mapUserDetail
 *
 * @param {Object|null} user
 *
 * @returns {Object} - Modèle détail
 */

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

/**
 * MAP USER TO FORM
 * =========================================================================================
 * Transforme un utilisateur API en modèle formulaire.
 *
 * @function mapUserToForm
 *
 * @param {Object} user
 *
 * @returns {Object} - Modèle formulaire
 */

export function mapUserToForm(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}