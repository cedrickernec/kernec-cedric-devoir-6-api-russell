/**
 * --------------------------------------------------------------------
 * Mapper de vue - Catway
 * --------------------------------------------------------------------
 */

import { formatDateFR } from "../dateFormatter.js";

/* ==================================================
  MAPPER CATWAY DETAIL
================================================== */

export function mapCatwayToDetail(catway) {
  const catwayState = catway.state;
  const isOutOfService = catway.isOutOfService;
  const createdAt = catway.createdAt
    ? new Date(catway.createdAt)
    : null;

  let status;

  if (isOutOfService) {
    status = {
      label: catwayState,
      className: "status--danger",
      aria: "Catway hors service, non réservable",
    };
  } 
  else if (catwayState === "bon état") {
    status = {
      label: catwayState,
      className: "status--ok",
      aria: "Catway en bon état",
    };
  } 
  else {
    status = {
      label: catwayState,
      className: "status--warning",
      aria: "Catway réservable nécessitant une attention",
    };
  }

  return {
    id: catway.id,

    catwayNumber: catway.number,
    catwayType: catway.type,

    isOutOfService: catway.isOutOfService,

    state: status,

    createdAtFormatted: formatDateFR(createdAt)
  };
}

/* ==================================================
  MAPPER CATWAY LIST (TABLE)
================================================== */

export function mapCatwayToList(catway) {
  const catwayState = catway.state;
  const isOutOfService = catway.isOutOfService;

  let status;

  if (isOutOfService) {
    status = {
      label: catwayState,
      className: "status--danger",
      aria: "Catway hors service, non réservable",
    };
  } 
  else if (catwayState === "bon état") {
    status = {
      label: catwayState,
      className: "status--ok",
      aria: "Catway en bon état",
    };
  } 
  else {
    status = {
      label: catwayState,
      className: "status--warning",
      aria: "Catway réservable nécessitant une attention",
    };
  }

  return {
    id: catway.id,

    catwayNumber: catway.number,
    catwayType: catway.type,
    catwayState,

    isOutOfService,

    status
  };
}

/* ==================================================
  MAPPER CATWAY FORM
================================================== */

export function mapCatwayToForm(catway) {
  return {
    number: catway.number,
    type: catway.type,
    state: catway.state?.label ?? catway.state,
    isOutOfService: catway.isOutOfService
  };
}