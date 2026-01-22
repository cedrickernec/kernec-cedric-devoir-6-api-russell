/**
 * ===================================================================
 * CATWAY VALIDATORS
 * ===================================================================
 * - Empêche les données invalides d'entrer dans l'application :
 *      - Vérifie la validité des données entrantes
 *      - Contrôle les formats, types et champs obligatoires
 * ===================================================================
 */

export function validateCatwayCreate(body) {
    const errors = {};

    // N° catway obligatoire
    if(!body.catwayNumber && body.catwayNumber !== 0) {
        errors.catwayNumber = "Champ obligatoire manquant : Numéro de catway";
    }

    // Type obligatoire
    const ALLOWED_TYPES = ["short", "long"];
    if (!body.catwayType) {
        errors.catwayType = "Champ obligatoire manquant : Type de catway";
    } else if (!ALLOWED_TYPES.includes(body.catwayType)) {
        errors.catwayType = "Type de catway invalide. Valeurs autorisées : short ou long";
    }

    // État obligatoire
    if (!body.catwayState) {
        errors.catwayState = "Champ obligatoire manquant : État du catway"
    }

    return errors
};

export function validateCatwayUpdate(body) {
    const errors = {};

    if (body.isOutOfService !== undefined && typeof body.isOutOfService !== "boolean") {
        errors.isOutOfService = "Le champ isOutOfService doit être un booléen."
    }

    if (
        body.catwayState !== undefined &&
        (typeof body.catwayState !== "string" ||
        body.catwayState.trim() === "")) {
            errors.catwayState = "L'état du catway doit être une chaîne de caractère non vide."
    }

    return errors;
};