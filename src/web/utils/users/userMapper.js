/**
 * --------------------------------------------------------------------
 * Mapper de vue - User
 * --------------------------------------------------------------------
 */

import { formatDateFR } from "../dateFormatter.js";

/* ==================================================
  MAPPER USER DETAIL
================================================== */

export function mapUserDetail(user) {
  if (!user) {
    return {
      id: null,
      username: "-",
      email: "-",
      createdAtFormatted: "Non disponible"
    };
  }

  const createdAt =
  user.createdAt
    ? new Date(user.createdAt)
    : null;

  return {
    id: user.id,

    username: user.username ?? "-",
    email: user.email ?? "-",

    createdAtFormatted: formatDateFR(createdAt)
  };
}

/* ==================================================
  MAPPER USER LIST (TABLE)
================================================== */

export function mapUserToList(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  }
}