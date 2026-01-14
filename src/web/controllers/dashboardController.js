/**
 * --------------------------------------------------------------------
 * Dashboard utilisateur
 * --------------------------------------------------------------------
 * - Affiche l'utilisateur connecté et la date du jour
 * - Liste les réservations en cours et à venir
 * - Tolère les erreurs de chargement partiel
 */

import Reservation from "../../api/models/Reservation.js";
import { formatDateLongFR } from "../utils/dateFormatter.js";
import { mapReservationToDashboard } from "../utils/reservations/reservationDashboardMapper.js";

export const getDashboard = async (req, res, next) => {
    let reservations = [];
    let dashboardError = null;

    try {
        // ========================================================
        // DATE DU JOUR FORMATÉE
        // ========================================================

        const now = new Date();
        const formattedToday = formatDateLongFR(now);

        // ========================================================
        // RÉSERVATIONS EN COURS / À VENIR
        // ========================================================

        try {
        const rawReservations = await Reservation.find({
            endDate: { $gte: now },
        }).sort({ startDate: 1 });

        reservations = rawReservations.map(mapReservationToDashboard);
        } catch (error) {
        console.error(
            "Erreur de chargement des données de réservations :",
            error
        );
        dashboardError = "Impossible de charger les réservations.";
        }

        // ========================================================
        // RENDER
        // ========================================================

        res.render("dashboard", {
        title: "Dashboard - API Russell",
        activePage: "dashboard",
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