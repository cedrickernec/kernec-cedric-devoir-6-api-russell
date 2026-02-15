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

import Catway from "../../../../api/models/Catway.js";

export async function findNextCatwayNumber() {

    // Récupération des numéros existants
    const catways = await Catway
    .find({}, { catwayNumber: 1, _id: 0 })
    .sort({ catwayNumber: 1 });

    let expected = 1;

    // Recherche du premier trou dans la séquence
    for (const catway of catways) {
        if (catway.catwayNumber !== expected) {
            return expected;
        }
        expected++;
    }

    // Aucun trou → prochain numéro logique
    return expected;
}