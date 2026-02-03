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

import usersFormRoutes from "./users/form.routes.js";
import usersViewRoutes from "./users/view.routes.js";
import usersAjaxRoutes from "./users/ajax.routes.js";

import catwaysFormRoutes from "./catways/form.routes.js";
import catwaysViewRoutes from "./catways/view.routes.js";
import catwaysAjaxRoutes from "./catways/ajax.routes.js";

import reservationsFormRoutes from "./reservations/form.routes.js";
import reservationsViewRoutes from "./reservations/view.routes.js";
import reservationsAjaxRoutes from "./reservations/ajax.routes.js";

export function registerWebRoutes(app) {
    app.use("/", homeRoutes);
    app.use("/auth", authViewRoutes);
    app.use("/session", sessionAjaxRoutes);

    app.use("/documentation", docViewRoutes);

    app.use("/dashboard", dashboardRoutes);

    app.use("/users", usersViewRoutes);
    app.use("/users", usersFormRoutes);
    app.use("/users/ajax", usersAjaxRoutes);

    app.use("/catways", catwaysViewRoutes); // → avec routes Réservations imbriquées
    app.use("/catways", catwaysFormRoutes); // → avec routes Réservations imbriquées
    app.use("/catways/ajax", catwaysAjaxRoutes);

    app.use("/reservations", reservationsViewRoutes);
    app.use("/reservations", reservationsFormRoutes);
    app.use("/reservations/ajax", reservationsAjaxRoutes);
}