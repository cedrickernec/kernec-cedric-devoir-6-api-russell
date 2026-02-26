/**
 * ENTITY TABLE MODULE
 * =========================================================================================
 * @module entityTable
 *
 * Adaptateur léger entre une entité métier
 * et le moteur générique bulkTableCore.
 *
 * Permet de configurer une table
 * sans exposer directement la logique interne du core.
 */

import { initBulkTable } from "./tableCore.js";

/**
 * ENTITY TABLE INITIALISER
 * =========================================================================================
 * Initialise une table d’entité via le moteur générique.
 *
 * Sert de couche d’abstraction pour injecter
 * la configuration spécifique à une entité.
 *
 * @function initEntityTable
 * 
 * @param {Object} config
 * 
 * @returns {void}
 */

export function initEntityTable(config) {
    initBulkTable(config)
}