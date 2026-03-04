/**
 * REGISTER API ROUTES
 * =========================================================================================
 * @module index
 *
 * Point de montage central des routes API.
 *
 * Responsabilités :
 * - Enregistrer les routeurs par domaine sous leurs préfixes /api/*
 *
 * Dépendances :
 * - authRoutes
 * - userRoutes
 * - catwayRoutes
 * - reservationGlobalRoutes
 *
 * Effets de bord :
 * - Monte des routeurs sur l’instance Express (app.use)
 */

import authApiRoutes from "./authRoutes.js"
import userApiRoutes from "./userRoutes.js";
import catwayApiRoutes from "./catwayRoutes.js";
import reservationGlobalApiRoutes from "./reservationGlobalRoutes.js";

/**
 * REGISTER API ROUTES
 * =========================================================================================
 * Enregistre tous les routeurs API sur l’application.
 *
 * @function registerApiRoutes
 *
 * @param {Object} app Instance Express (doit exposer app.use)
 *
 * @returns {void}
 */

export function registerApiRoutes(app) {
    app.use("/api/auth", authApiRoutes);
    app.use("/api/users", userApiRoutes);
    app.use("/api/catways", catwayApiRoutes);
    app.use("/api/reservations", reservationGlobalApiRoutes);
}