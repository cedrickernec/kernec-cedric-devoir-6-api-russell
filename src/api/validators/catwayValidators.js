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

    // N° catway
    if(!body.catwayNumber === undefined || body.catwayNumber === "") {
        errors.catwayNumber = "Champ obligatoire manquant : Numéro de catway.";
    } else {
        const number = Number(body.catwayNumber);

        if (!Number.isFinite(number)) {
            errors.catwayNumber = "Le numéro du catway doit être un nombre valide."
        } else if (!Number.isInteger(number)) {
            errors.catwayNumber = "Le numéro du catway doit être un nombre entier."
        } else if (number <1) {
            errors.catwayNumber = "Le numéro du catway doit être supérieur ou égal à 1."
        }
    }

    // Type de catway
    const ALLOWED_TYPES = ["short", "long"];
    if (!body.catwayType) {
        errors.catwayType = "Champ obligatoire manquant : Type de catway.";
    } else if (!ALLOWED_TYPES.includes(body.catwayType)) {
        errors.catwayType = "Type de catway invalide. Valeurs autorisées : short ou long.";
    }

    // État du catway
    if (!body.catwayState) {
        errors.catwayState = "Champ obligatoire manquant : État du catway."
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