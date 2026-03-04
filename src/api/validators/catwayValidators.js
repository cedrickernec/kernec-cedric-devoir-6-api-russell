/**
 * CATWAY VALIDATORS
 * =========================================================================================
 * @module catwayValidators
 *
 * Validation des données Catway (création / mise à jour).
 *
 * Objectifs :
 * - Empêcher des données incohérentes d’entrer dans l’application
 * - Centraliser les règles de validation “formulaire”
 *
 * Stratégie :
 * - Retourne un objet `errors` (pas de throw ici)
 * - Le controller décide : si errors non vide → ApiError.validation(...)
 */

/**
 * VALIDATE CATWAY CREATE
 * =========================================================================================
 * Valide les données de création d’un catway.
 *
 * Règles principales :
 * - catwayNumber requis, entier, >= 1
 * - catwayType requis, dans ["short","long"]
 * - catwayState requis
 *
 * @function validateCatwayCreate
 *
 * @param {Object} body Données filtrées (cleanData)
 *
 * @returns {Object} errors Erreurs par champ (vide si OK)
 */

export function validateCatwayCreate(body) {
    const errors = {};

    // N° catway
    if(body.catwayNumber === null || body.catwayNumber === "") {
        errors.catwayNumber = "Champ obligatoire manquant : Numéro de catway.";
    } else {
        const number = Number(body.catwayNumber);

        if (!Number.isFinite(number)) {
            errors.catwayNumber = "Le numéro de catway doit être un nombre valide."
        } else if (!Number.isInteger(number)) {
            errors.catwayNumber = "Le numéro de catway doit être un nombre entier."
        } else if (number <1) {
            errors.catwayNumber = "Le numéro de catway doit être supérieur ou égal à 1."
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

/**
 * VALIDATE CATWAY UPDATE
 * =========================================================================================
 * Valide les données de mise à jour d’un catway.
 *
 * Règles principales :
 * - isOutOfService, si présent, doit être un booléen
 * - catwayState, si présent, doit être une string non vide
 *
 * @function validateCatwayUpdate
 *
 * @param {Object} body Données filtrées (cleanData)
 *
 * @returns {Object} errors Erreurs par champ (vide si OK)
 */

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

/**
 * VALIDATE CATWAY CHECK NUMBER
 * =========================================================================================
 * Valide les paramètres de vérification de disponibilité d’un numéro de catway.
 *
 * Règles principales :
 * - catwayNumber requis
 * - catwayNumber doit être un entier >= 1
 * - excludeId optionnel (string si présent)
 *
 * @function validateCheckCatwayNumber
 *
 * @param {Object} query Paramètres de requête (req.query)
 *
 * @returns {Object} errors Erreurs par champ (vide si OK)
 */

export function validateCheckCatwayNumber(query) {
    const errors = {};

    // Numéro à vérifier
    if (query.catwayNumber === undefined || query.catwayNumber === "") {
        errors.catwayNumber = "Le paramètre catwayNumber est requis.";
    } else {
        const number = Number(query.catwayNumber);
        if (!Number.isFinite(number)) {
            errors.catwayNumber = "Le numéro de catway doit être un nombre valide.";
        } else if (!Number.isInteger(number)) {
            errors.catwayNumber = "Le numéro de catway doit être un nombre entier.";
        } else if (number < 1) {
            errors.catwayNumber = "Le numéro de catway doit être supérieur ou égal à 1.";
        }
    }

    // excludeId
    if (query.excludeId !== undefined && typeof query.excludeId !== "string") {
        errors.excludeId = "excludeId doit être une chaîne de caractères valide.";
    }

    return errors;
}