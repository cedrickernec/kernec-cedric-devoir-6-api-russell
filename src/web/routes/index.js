/**
 * ===================================================================
 * REGISTER WEB ROUTES
 * ===================================================================
 * - Registre de toutes les routes web
 * ===================================================================
 */

import homeRoutes from "./homeRoutes.js"
import authViewRoutes from "./authRoutes.js";
import sessionAjaxRoutes from "./sessionAjaxRoutes.js";

import docViewRoutes from "./docRoutes.js";

import dashboardRoutes from "./dashboardRoutes.js";

import usersAjaxRoutes from "./users/ajaxRoutes.js";
import usersFormRoutes from "./users/formRoutes.js";
import usersViewRoutes from "./users/viewRoutes.js";

import catwaysAjaxRoutes from "./catways/ajaxRoutes.js";
import catwaysFormRoutes from "./catways/formRoutes.js";
import catwaysViewRoutes from "./catways/viewRoutes.js";

import reservationsAjaxRoutes from "./reservations/ajaxRoutes.js";
import reservationsFormRoutes from "./reservations/formRoutes.js";
import reservationsViewRoutes from "./reservations/viewRoutes.js";

export function registerWebRoutes(app) {
    app.use("/", homeRoutes);
    app.use("/auth", authViewRoutes);
    app.use("/session", sessionAjaxRoutes);

    app.use("/documentation", docViewRoutes);

    app.use("/dashboard", dashboardRoutes);

    app.use("/ajax/users", usersAjaxRoutes);
    app.use("/users", usersViewRoutes);
    app.use("/users", usersFormRoutes);

    app.use("/ajax/catways", catwaysAjaxRoutes);
    app.use("/catways", catwaysViewRoutes); // → avec routes Réservations imbriquées
    app.use("/catways", catwaysFormRoutes); // → avec routes Réservations imbriquées

    app.use("/ajax/reservations", reservationsAjaxRoutes);
    app.use("/reservations", reservationsViewRoutes);
    app.use("/reservations", reservationsFormRoutes);
}