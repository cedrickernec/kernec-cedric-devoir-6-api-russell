/**
 * VIEW MAPPER - CATWAYS
 * =========================================================================================
 * @module catwayMapper
 *
 * Adaptateur API → ViewModel pour les catways.
 *
 * Responsabilités :
 * - Transformer les données API en modèles exploitables par les vues
 * - Centraliser la logique de présentation (status, formatage dates)
 * - Éviter toute logique UI dans les contrôleurs
 *
 * Dépendances :
 * - buildCatwayStatus
 * - formatDateFR
 */

import { buildCatwayStatus } from "../business/catways/catwayStatus.js";
import { formatDateFR } from "../formatters/dateFormatter.js";

/**
 * MAP CATWAY TO LIST
 * =========================================================================================
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

/**
 * MAP CATWAY TO DETAIL
 * =========================================================================================
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

/**
 * MAP CATWAY TO FORM
 * =========================================================================================
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