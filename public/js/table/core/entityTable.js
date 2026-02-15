/**
 * ===================================================================
 * ENTITY TABLE INITIALISER
 * ===================================================================
 * - Point d'entrée unifié pour l'initialisation des tables d'entités
 * - Sert de façade au moteur tableCore
 * - Évite aux pages d'importer directement la logique interne
 * ===================================================================
 * Objectif :
 * → Découpler les pages UI du moteur de table générique
 * → Permettre une évolution interne sans casser les imports
 * ===================================================================
 */

import { initBulkTable } from "./tableCore.js";

export function initEntityTable(config) {
    initBulkTable(config)
}