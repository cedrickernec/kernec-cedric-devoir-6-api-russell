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
/**
 * Transforme un catway API en modèle liste (table).
 *
 * - Construit le statut visuel via buildCatwayStatus
 * - Conserve les informations essentielles pour affichage rapide
 *
 * @function mapCatwayToList
 *
 * @param {Object} catway
 * @param {string} catway.id
 * @param {number|string} catway.catwayNumber
 * @param {string} catway.catwayType
 * @param {string} catway.catwayState
 * @param {boolean} catway.isOutOfService
 * @param {string} catway.stateKey
 *
 * @returns {Object} - Modèle liste
 */
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
/**
 * Transforme un catway API en modèle détail.
 *
 * - Ajoute les dates formatées
 * - Construit le statut visuel
 *
 * @function mapCatwayToDetail
 *
 * @param {Object} catway
 *
 * @returns {Object} Modèle détail
 */
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
/**
 * Transforme un catway API en modèle formulaire.
 *
 * - Prépare les champs nécessaires à l'édition
 *
 * @function mapCatwayToForm
 *
 * @param {Object} catway
 *
 * @returns {Object} Modèle formulaire
 */
export function mapCatwayToForm(catway) {
    return {
      id: catway.id,
      number: catway.catwayNumber,
      type: catway.catwayType,
      state: catway.catwayState,
      isOutOfService: catway.isOutOfService
    };
}