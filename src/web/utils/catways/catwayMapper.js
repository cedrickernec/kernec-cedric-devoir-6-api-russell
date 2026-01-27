/**
 * --------------------------------------------------------------------
 * Mapper de vue - Catway
 * --------------------------------------------------------------------
 */

import { formatDateFR } from "../dateFormatter.js";
import { buildCatwayStatus } from "./catwayStatus.js";

/* ==================================================
  MAPPER CATWAY DETAIL
================================================== */

export function mapCatwayToDetail(catway) {

  const createdAt = catway.createdAt
    ? new Date(catway.createdAt)
    : null;

  return {
    id: catway.id,

    catwayNumber: catway.catwayNumber,
    catwayType: catway.catwayType,

    isOutOfService: catway.isOutOfService,

    catwayState: buildCatwayStatus(catway),

    createdAtFormatted: formatDateFR(createdAt)
  };
}

/* ==================================================
  MAPPER CATWAY LIST (TABLE)
================================================== */

export function mapCatwayToList(catway) {

  return {
    id: catway.id,

    catwayNumber: catway.catwayNumber,
    catwayType: catway.catwayType,
    catwayState: catway.catwayState,

    isOutOfService: catway.isOutOfService,

    status: buildCatwayStatus(catway)
  };
}

/* ==================================================
  MAPPER CATWAY FORM
================================================== */

export function mapCatwayToForm(catway) {
  return {
    number: catway.catwayNumber,
    type: catway.catwayType,
    state: catway.state?.label ?? catway.catwayState,
    isOutOfService: catway.isOutOfService
  };
}