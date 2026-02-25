/**
 * ===================================================================
 * REGISTER API ROUTES
 * ===================================================================
 */

import authApiRoutes from "./authRoutes.js"
import userApiRoutes from "./userRoutes.js";
import catwayApiRoutes from "./catwayRoutes.js";
import reservationGlobalApiRoutes from "./reservationGlobalRoutes.js";

/**
 * Enregistre toutes les routes API sur l'application Express.
 *
 * - Monte les routes d'authentification
 * - Monte les routes utilisateurs
 * - Monte les routes catways
 * - Monte les routes réservations globales
 *
 * @function registerApiRoutes
 *
 * @param {Object} app - Instance Express
 *
 * @returns {void}
 */
export function registerApiRoutes(app) {
    app.use("/api/auth", authApiRoutes);
    app.use("/api/users", userApiRoutes);
    app.use("/api/catways", catwayApiRoutes);
    app.use("/api/reservations", reservationGlobalApiRoutes);
}