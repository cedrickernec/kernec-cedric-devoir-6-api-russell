/**
 * --------------------------------------------------------------------
 * Helper - Attribution des numéros de catway
 * --------------------------------------------------------------------
 * - Calcule le prochain numéro de catway disponible
 * - Gère les trous dans la numérotation existante
 * - Utilisé lors de la création d'un nouveau catway
 */

import Catway from "../../../api/models/Catway.js";

export async function findNextCatwayNumber() {
    const catways = await Catway
    .find({}, { catwayNumber: 1, _id: 0 })
    .sort({ catwayNumber: 1 });

    let expected = 1;

    for (const catway of catways) {
        if (catway.catwayNumber !== expected) {
            return expected;
        }
        expected++;
    }

    return expected;
}