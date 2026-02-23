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

export async function findNextCatwayNumber(req, res) {

    // Récupération API
    const apiData = await fetchNextCatwayNumber(req, res);

    if (!apiData?.success) {
        throw new Error("Impossible de récupérer le prochain numéro de catway.")
    }

    return apiData.data;
}