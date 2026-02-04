/**
 * ===================================================================
 * CATWAY API
 * ===================================================================
 * - Récupération des catways dans l'API
 * ===================================================================
 */

import { apiFetch } from "./apiClient.js";

// ==================================================
// FETCH CATWAYS
// ==================================================

export async function fetchCatways(req, res) {

    return apiFetch("/api/catways", {}, req, res);
}

// ==================================================
// FETCH CATWAY BY NUMBER
// ==================================================

export async function fetchCatwayByNumber(number, req, res) {

    return apiFetch(`/api/catways/${number}`, {}, req, res);
}

// ==================================================
// CREATE CATWAY
// ==================================================

export async function createCatway(data, req, res) {

    return apiFetch(
        "/api/catways", {
            method: "POST",
            body: JSON.stringify(data)
            }, req, res
    );
}

// ==================================================
// UPDATE CATWAY
// ==================================================

export async function updateCatway(number, data, req, res) {

    return apiFetch(
        `/api/catways/${number}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }, req, res
    );
}

// ==================================================
// DELETE CATWAY
// ==================================================

export async function deleteCatway(number, req, res) {

    return apiFetch(
        `/api/catways/${number}`, {
            method: "DELETE",
        }, req, res
    );
}