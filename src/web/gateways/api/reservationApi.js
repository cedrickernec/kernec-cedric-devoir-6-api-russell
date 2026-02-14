/**
 * ===================================================================
 * RESERVATION API
 * ===================================================================
 * - Récupération des réservations dans l'API
 * ===================================================================
 */

import { apiFetch } from "./apiFetch.js";

// ==================================================
// FETCH RESERVATIONS
// ==================================================

export function fetchReservations(req, res) {
    return apiFetch("/api/reservations", {
        method: "GET"
    }, req, res);
}

// ==================================================
// FETCH RESERVATIONS BY CATWAY
// ==================================================

export function fetchReservationsByCatway(catwayNumber, req, res) {
    return apiFetch(`/api/catways/${catwayNumber}/reservations`, {
        method: "GET"
    }, req, res);
}

// ==================================================
// FETCH RESERVATIONS BY ID
// ==================================================

export function fetchReservationById(catwayNumber, reservationId, req, res) {
    return apiFetch(
        `/api/catways/${catwayNumber}/reservations/${reservationId}`, {
            method: "GET"
        }, req, res
    );
}

// ==================================================
// FETCH RESERVATION AVAILABILITY
// ==================================================

export function fetchReservationAvailability(payload, req, res) {
    return apiFetch(
        "/api/reservations/availability", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

// ==================================================
// CREATE RESERVATION
// ==================================================

export function createReservation(catwayNumber, payload, req, res) {
    return apiFetch(
        `/api/catways/${catwayNumber}/reservations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

// ==================================================
// UPDATE RESERVATION
// ==================================================

export function updateReservation(catwayNumber, reservationId, payload, req, res) {
    return apiFetch(
        `/api/catways/${catwayNumber}/reservations/${reservationId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }, req, res
    );
}

// ==================================================
// DELETE RESERVATION
// ==================================================

export function deleteReservation(catwayNumber, reservationId, req, res, password = null) {

    const options = { method: "DELETE" };

    if (password) {
        options.body = JSON.stringify({ password });
    }

    return apiFetch(
        `/api/catways/${catwayNumber}/reservations/${reservationId}`,
        options,
        req,
        res
    );
}