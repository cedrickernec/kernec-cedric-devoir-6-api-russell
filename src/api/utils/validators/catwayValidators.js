export function validateCatwayData(body) {
    const errors = {};

    // N° catway obligatoire
    if(!body.catwayNumber && body.catwayNumber !== 0) {
        errors.catwayNumber = "Champ obligatoire manquant : Numéro de catway";
    }

    // Type obligatoire
    if(!body.catwayType) {
        errors.catwayType = "Champ obligatoire manquant : Type de catway";
    }

    // État obligatoire
    if (!body.catwayState || typeof body.catwayState !== "string" || body.catwayState.trim() === "") {
        errors.catwayState = "Champ obligatoire manquant ou invalide : État du catway"
    }

    return errors
}