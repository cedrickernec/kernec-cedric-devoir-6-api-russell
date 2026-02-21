/**
 * ===================================================================
 * DASHBOARD VIEW CONTROLLER
 * ===================================================================
 * - Affiche le dashboard utilisateur
 * - Charge les réservations actives
 * - Tolère les erreurs de chargement partiel
 * ===================================================================
 */

import { formatDateLongFR } from "../utils/formatters/dateFormatter.js";
import { mapReservationToDashboard } from "../utils/mappers/reservationDashboardMapper.js";
import { fetchReservations } from "../gateways/api/reservationApi.js";
import { handleAuthExpired } from "../middlewares/auth/authExpiredHandler.js";
import { COMMON_MESSAGES } from "../../../public/js/messages/commonMessages.js";

// ==================================================
// DASHBOARD PAGE
// ==================================================

export const getDashboard = async (req, res, next) => {
    let reservations = [];
    let dashboardError = null;

    try {

        const now = new Date();
        const formattedToday = formatDateLongFR(now);

        // Chargement des réservations
        try {
            const apiData = await fetchReservations(req, res);

            if (handleAuthExpired(apiData, req, res)) return;

            if (!apiData) {
                throw new Error("apiData est undefined ou null");
            }

            if (!apiData.success) {
                return next (new Error(apiData?.message || COMMON_MESSAGES.SERVER_ERROR_LONG));
            }

            const allReservations = apiData.data;
            const upcomingReservations = allReservations
                .filter(r => new Date(r.endDate) >= now)
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

            reservations = upcomingReservations.map(mapReservationToDashboard);

        } catch (error) {
            console.error(
                "Erreur de chargement des données de réservations :",
                error
            );
            dashboardError = "Impossible de charger les réservations.";
        }

        res.render("dashboard", {
            title: "Dashboard - API Russell",
            activePage: "dashboard",
            bodyClass: "scroll-main dashboard-page",
            user: req.session.user,
            today: formattedToday,
            reservations,
            dashboardError,
        });

    } catch (error) {
        error.status = 500;
        next(error);
    }
};