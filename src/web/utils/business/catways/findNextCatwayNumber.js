/**
 * CATWAY NUMBER HELPER (WEB)
 * =========================================================================================
 * @module findNextCatwayNumber
 *
 * Détermine le prochain numéro de catway disponible.
 *
 * Responsabilités :
 * - Interroger l’API via gateway
 * - Garantir une attribution cohérente
 *
 * Dépendances :
 * - fetchNextCatwayNumber
 *
 * Effets de bord :
 * - Lance une erreur en cas d’échec API
 */

import { fetchNextCatwayNumber } from "../../../gateways/api/catwayApi.js";

/**
 * FIND NEXT CATWAY NUMBER
 * =========================================================================================
 * Récupère le prochain numéro disponible via l’API.
 *
 * @function findNextCatwayNumber
 * @async
 *
 * @param {Object} req
 * @param {Object} res
 *
 * @returns {Promise<number>}
 *
 * @throws {Error} Si l’API retourne un échec
 */

export async function findNextCatwayNumber(req, res) {

    // Récupération API
    const apiData = await fetchNextCatwayNumber(req, res);

    if (!apiData?.success) {
        throw new Error("Impossible de récupérer le prochain numéro de catway.")
    }

    return apiData.data;
}