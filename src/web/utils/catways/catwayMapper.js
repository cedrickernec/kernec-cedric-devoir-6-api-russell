import { buildCatwayStatus } from "./catwayStatus.js";
import { formatDateFR } from "../dateFormatter.js";

/* ==================================================
  MAPPER CATWAY LIST (TABLE)
================================================== */

export function mapCatwayToList(catway) {

    const status = buildCatwayStatus({
        catwayState: catway.catwayState,
        isOutOfService: catway.isOutOfService
    });

  return {
    number: catway.catwayNumber,
    type: catway.catwayType,
    status,
    stateKey: status.className
  };
}

/* ==================================================
  MAPPER CATWAY DETAIL
================================================== */

export function mapCatwayToDetail(catway) {

  const status = buildCatwayStatus({
      catwayState: catway.catwayState,
      isOutOfService: catway.isOutOfService
  });

  return {
    number: catway.catwayNumber,
    type: catway.catwayType,
    status,
    createdAtFormatted: formatDateFR(catway.createdAt)
  };
}

/* ==================================================
  MAPPER CATWAY FORM
================================================== */

export function mapCatwayToForm(catway) {
    return {
        number: catway.catwayNumber,
        type: catway.catwayType,
        state: catway.catwayState,
        isOutOfService: catway.isOutOfService
    };
}