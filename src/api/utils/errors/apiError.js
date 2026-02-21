/**
 * ===================================================================
 * APIERROR
 * ===================================================================
 * - Erreur métier personnalisée pour l'API
 *   - Centralise la gestion des erreurs HTTP + métier
 *   - Intercepté par le middleware apiErrorHandler
 * ===================================================================
 */

export class ApiError extends Error {

    /**
     * 
     * @param {number} status - code HTTP
     * @param {string|null} message - Message global (optionnel)
     * @param {object|null} detail - Détails métier
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
     * 
     * @param {string} message 
     * @param {object|null} detail
     * @returns {ApiError}
     */
    static badRequest(message, detail = null) {
        return new ApiError(400, message, detail);
    }

    /**
     * 
     * @param {string} message
     * @param {object|null} context
     * @returns {ApiError}
     */
    static notFound(message = "Ressource introuvable", context = null) {
        return new ApiError(404, message, context ? { context } : null);
    }

    /**
     * 
     * @param {string} message 
     * @returns {ApiError}
     */
    static forbidden(message = "Accès interdit") {
        return new ApiError(403, message);
    }

    /**
     * 
     * @param {string} message 
     * @returns {ApiError}
     */
    static unauthorized(message = "Non autorisé") {
        return new ApiError(401, message);
    }

    // ==================================================
    // VALIDATION
    // Erreur de validation de formulaire
    // ==================================================
    /**
     * 
     * @param {Object<string, any>} fields
     * @param {string} message
     * @returns {ApiError}
     */
    static validation(fields, message = "Donnée(s) invalide(s).") {
        return new ApiError(400, message, { fields });
    }

    // ==================================================
    // FIELD CONFLICT
    // Conflit sur un champ précis
    // ==================================================
    /**
     * 
     * @param {string} field 
     * @param {string} message 
     * @param {object|null} conflictWith
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

    // ==================================================
    // RESOURCE CONFLICT
    // Conflit avec une ressource
    // ==================================================
    /**
     * 
     * @param {string} message 
     * @param {object|null} conflictWith
     * @returns {ApiError}
     */
    static resourceConflict(message, conflictWith = null) {
        return new ApiError(409, message, { conflictWith });
    }

    // ==================================================
    // BUSINESS CONFLICT
    // Conflit métier global
    // ==================================================
    /**
     * 
     * @param {string} message 
     * @param {object|null} context
     * @returns {ApiError}
     */
    static businessConflict(message, context = null) {
        return new ApiError(409, message, context ? { context } : null);
    }
}