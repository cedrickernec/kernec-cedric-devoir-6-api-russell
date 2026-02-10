/**
 * ===================================================================
 * REGISTER WEB ROUTES
 * ===================================================================
 * - Registre de toutes les routes web
 * ===================================================================
 */

import homeRoutes from "./home.routes.js"
import authViewRoutes from "./auth.routes.js";
import sessionAjaxRoutes from "./sessionAjax.routes.js";

import docViewRoutes from "./doc.routes.js";

import dashboardRoutes from "./dashboard.routes.js";

import usersAjaxRoutes from "./users/ajax.routes.js";
import usersFormRoutes from "./users/form.routes.js";
import usersViewRoutes from "./users/view.routes.js";

import catwaysAjaxRoutes from "./catways/ajax.routes.js";
import catwaysFormRoutes from "./catways/form.routes.js";
import catwaysViewRoutes from "./catways/view.routes.js";

import reservationsAjaxRoutes from "./reservations/ajax.routes.js";
import reservationsFormRoutes from "./reservations/form.routes.js";
import reservationsViewRoutes from "./reservations/view.routes.js";

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