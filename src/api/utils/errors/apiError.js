/**
 * API ERROR
 * =========================================================================================
 * @module ApiError
 *
 * Erreur personnalisée utilisée pour normaliser les erreurs HTTP + métier dans l’API.
 *
 * Objectifs :
 * - Porter un status HTTP (err.status)
 * - Porter des détails structurés (err.detail) :
 *    - fields        : erreurs de validation par champ
 *    - conflictWith  : ressource en conflit (payload utile au front)
 *    - context       : informations métier/diagnostic
 *
 * Cette erreur est consommée par le middleware global apiErrorHandler qui transforme
 * l’exception en JSON standardisé.
 */

/**
 * API ERROR CLASS
 * =========================================================================================
 * Représente une erreur applicative normalisée.
 *
 * @class ApiError
 * @extends Error
 */

export class ApiError extends Error {

    /**
     * @constructor
     *
     * @param {number} status Code HTTP
     * @param {string|null} message Message global (optionnel)
     * @param {object|null} [detail=null] Détails structurés (validation, conflict, context…)
     */

    constructor(status, message, detail = null) {
        super(message);
        this.status = status;
        this.detail = detail;
    }

    // ==================================================
    // GENERIC
    // ==================================================

    /**
     * BAD REQUEST
     * =========================================================================================
     * @static
     * @function badRequest
     *
     * @param {string} message
     * @param {object|null} [detail=null]
     *
     * @returns {ApiError}
     */

    static badRequest(message, detail = null) {
        return new ApiError(400, message, detail);
    }

    /**
     * NOT FOUND
     * =========================================================================================
     * @static
     * @function notFound
     *
     * @param {string} [message="Ressource introuvable"]
     * @param {object|null} [context=null]
     *
     * @returns {ApiError}
     */

    static notFound(message = "Ressource introuvable", context = null) {
        return new ApiError(404, message, context ? { context } : null);
    }

    /**
     * FORBIDDEN
     * =========================================================================================
     * @static
     * @function forbidden
     *
     * @param {string} [message="Accès interdit"]
     * @param {object|null} [context=null]
     *
     * @returns {ApiError}
     */

    static forbidden(message = "Accès interdit", context = null) {
        return new ApiError(403, message, context ? { context } : undefined);
    }

    /**
     * UNAUTHORIZED
     * =========================================================================================
     * @static
     * @function unauthorized
     *
     * @param {string} [message="Non autorisé"]
     * @param {object|null} [context=null]
     *
     * @returns {ApiError}
     */

    static unauthorized(message = "Non autorisé", context = null) {
        return new ApiError(401, message, context ? { context } : null);
    }

    /**
     * VALIDATION
     * =========================================================================================
     * Erreur de validation de formulaire
     * 
     * @static
     * @function validation
     *
     * @param {Object<string, any>} fields Erreurs par champ
     * @param {string} [message="Donnée(s) invalide(s)."]
     *
     * @returns {ApiError}
     */

    static validation(fields, message = "Donnée(s) invalide(s).") {
        return new ApiError(400, message, { fields });
    }

    /**
     * FIELD CONFLICT
     * =========================================================================================
     * Conflit sur un champ précis
     * 
     * @static
     * @function fieldConflict
     *
     * @param {string} message Message global
     * @param {string} field Nom du champ en conflit
     * @param {string} fieldMessage Message spécifique au champ
     * @param {object|null} [conflictWith=null] Payload optionnel décrivant la ressource en conflit
     *
     * @returns {ApiError}
     */

    static fieldConflict(message, field, fieldMessage, conflictWith = null) {
        return new ApiError(409, message, {
            fields: {
                [field]: fieldMessage
            },
            conflictWith
        });
    }

    /**
     * RESOURCE CONFLICT
     * =========================================================================================
     * Conflit avec une ressource
     * @static
     * @function resourceConflict
     *
     * @param {string} message
     * @param {object|null} [conflictWith=null]
     *
     * @returns {ApiError}
     */
    static resourceConflict(message, conflictWith = null) {
        return new ApiError(409, message, { conflictWith });
    }

    /**
     * BUSINESS CONFLICT
     * =========================================================================================
     * Conflit métier global
     * @static
     * @function businessConflict
     *
     * @param {string} message
     * @param {object|null} [context=null]
     *
     * @returns {ApiError}
     */

    static businessConflict(message, context = null) {
        return new ApiError(409, message, context ? { context } : null);
    }
}