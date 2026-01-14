/**
 * ===================================================================
 * ENTITY TABLE
 * ===================================================================
 * - Permet d'unifier l'initialisation des tables entités
 * - Évite l'exposition directe de tableCore aux pages
 * ===================================================================
 */

import { initBulkTable } from "./tableCore.js";

export function initEntityTable(config) {
    initBulkTable(config)
}