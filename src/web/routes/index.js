/**
 * --------------------------------------------------------------------
 * Enregistrement des routes WEB
 * --------------------------------------------------------------------
 */

import homeRoutes from "./homeRoutes.js"
import authViewRoutes from "./authRoutes.js";
import sessionAjaxRoutes from "./sessionAjaxRoutes.js";

import docViewRoutes from "./docRoutes.js";

import dashboardRoutes from "./dashboardRoutes.js";

import usersViewRoutes from "../routes/users/usersViewRoutes.js";
import usersAjaxRoutes from "../routes/users/usersAjaxRoutes.js";
import usersFormRoutes from "../routes/users/usersFormRoutes.js";

import catwaysViewRoutes from "../routes/catways/catwaysViewRoutes.js";
import catwaysAjaxRoutes from "../routes/catways/catwaysAjaxRoutes.js";
import catwaysFormRoutes from "../routes/catways/catwaysFormRoutes.js";

import reservationsViewRoutes from "../routes/reservations/reservationsViewRoutes.js";
import reservationsAjaxRoutes from "./reservations/reservationsAjaxRoutes.js";
import reservationsFormRoutes from "../routes/reservations/reservationsFormRoutes.js";

export function registerWebRoutes(app) {
    app.use("/", homeRoutes);
    app.use("/auth", authViewRoutes);
    app.use("/session", sessionAjaxRoutes);

    app.use("/documentation", docViewRoutes);

    app.use("/dashboard", dashboardRoutes);

    app.use("/users", usersViewRoutes);
    app.use("/users", usersFormRoutes);
    app.use("/users/ajax", usersAjaxRoutes);

    app.use("/catways", catwaysViewRoutes);
    app.use("/catways", catwaysFormRoutes);
    app.use("/catways/ajax", catwaysAjaxRoutes);

    app.use("/reservations", reservationsViewRoutes);
    app.use("/reservations", reservationsFormRoutes);
    app.use("/reservations/ajax", reservationsAjaxRoutes);
}