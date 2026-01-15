import authApiRoutes from "../routes/authRoutes.js"
import userApiRoutes from "../routes/userRoutes.js";
import catwayApiRoutes from "../routes/catwayRoutes.js";
import reservationApiRoutes from "../routes/reservationGlobalRoutes.js";

export function registerApiRoutes(app) {
    app.use("/api/auth", authApiRoutes);
    app.use("/api/users", userApiRoutes);
    app.use("/api/catways", catwayApiRoutes);
    app.use("/api/reservations", reservationApiRoutes);
}