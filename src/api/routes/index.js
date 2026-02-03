/**
 * ===================================================================
 * REGISTER API ROUTES
 * ===================================================================
 */

import authApiRoutes from "./auth.routes.js"
import userApiRoutes from "./user.routes.js";
import catwayApiRoutes from "./catway.routes.js";
import reservationGlobalApiRoutes from "./reservationGlobal.routes.js";

export function registerApiRoutes(app) {
    app.use("/api/auth", authApiRoutes);
    app.use("/api/users", userApiRoutes);
    app.use("/api/catways", catwayApiRoutes);
    app.use("/api/reservations", reservationGlobalApiRoutes);
}