/**
 * ===================================================================
 * REGISTER API ROUTES
 * ===================================================================
 */

import authApiRoutes from "./authRoutes.js"
import userApiRoutes from "./userRoutes.js";
import catwayApiRoutes from "./catwayRoutes.js";
import reservationGlobalApiRoutes from "./reservationGlobalRoutes.js";

export function registerApiRoutes(app) {
    app.use("/api/auth", authApiRoutes);
    app.use("/api/users", userApiRoutes);
    app.use("/api/catways", catwayApiRoutes);
    app.use("/api/reservations", reservationGlobalApiRoutes);
}