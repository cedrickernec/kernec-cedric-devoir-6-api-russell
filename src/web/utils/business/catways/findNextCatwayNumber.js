/**
 * ===================================================================
 * CATWAY NUMBER HELPER
 * ===================================================================
 * - Détermine le prochain numéro de catway disponible
 * - Détecte automatiquement les trous dans la numérotation
 * - Garantit une attribution séquentielle cohérente
 * ===================================================================
 * Utilisé lors de la création d'un nouveau catway.
 * ===================================================================
 */

import { fetchNextCatwayNumber } from "../../../gateways/api/catwayApi.js";

/**
 * Détermine le prochain numéro de catway disponible.
 *
 * - Appelle le gateway API
 * - Lance une erreur si la récupération échoue
 *
 * @async
 * @function findNextCatwayNumber
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<number>} - Prochain numéro disponible
 *
 * @throws {Error} - Si l'API ne retourne pas un succès
 */
export async function findNextCatwayNumber(req, res) {

    // Récupération API
    const apiData = await fetchNextCatwayNumber(req, res);

    if (!apiData?.success) {
        throw new Error("Impossible de récupérer le prochain numéro de catway.")
    }

    return apiData.data;
}