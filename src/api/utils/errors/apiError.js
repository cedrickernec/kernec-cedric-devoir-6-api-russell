/**
 * --------------------------------------------------------------------
 * APIERROR
 * --------------------------------------------------------------------
 * - Erreur métier personnalisée pour l'API
 *   - Centralise la gestion des erreurs HTTP côté API
 *   - Intercepté par le middleware apiErrorHandlers
 */

export class ApiError extends Error {
    constructor(status, message, details = null) {
        super(message);
        this.status = status;
        this.details = details;
    }
}