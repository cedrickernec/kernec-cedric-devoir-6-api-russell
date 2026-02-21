/**
 * ===================================================================
 * VIEW MAPPER - CATWAYS
 * ===================================================================
 * - Transforme les données API en ViewModels utilisables par les vues
 * - Centralise la logique d'adaptation UI (table / detail / formulaire)
 * - Évite toute logique de présentation dans les contrôleurs
 * ===================================================================
 */

import { buildCatwayStatus } from "../business/catways/catwayStatus.js";
import { formatDateFR } from "../formatters/dateFormatter.js";

/* ==================================================
  MAPPER - CATWAY LIST (TABLE)
================================================== */

export function mapCatwayToList(catway) {

    const status = buildCatwayStatus({
        catwayState: catway.catwayState,
        isOutOfService: catway.isOutOfService
    });

  return {
    id: catway.id,
    number: catway.catwayNumber,
    type: catway.catwayType,
    status,
    stateKey: catway.stateKey
  };
}

/* ==================================================
  MAPPER - CATWAY DETAIL
================================================== */

export function mapCatwayToDetail(catway) {

  const status = buildCatwayStatus({
      catwayState: catway.catwayState,
      isOutOfService: catway.isOutOfService
  });

  return {
    id: catway.id,
    number: catway.catwayNumber,
    type: catway.catwayType,
    status,
    createdAtFormatted: formatDateFR(catway.createdAt),
    updatedAtFormatted: formatDateFR(catway.updatedAt)
  };
}

/* ==================================================
  MAPPER - CATWAY FORM
================================================== */

export function mapCatwayToForm(catway) {
    return {
      id: catway.id,
      number: catway.catwayNumber,
      type: catway.catwayType,
      state: catway.catwayState,
      isOutOfService: catway.isOutOfService
    };
}