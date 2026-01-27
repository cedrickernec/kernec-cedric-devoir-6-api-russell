/**
 * ===================================================================
 * CATWAY API
 * ===================================================================
 * - Récupération des catways dans l'API
 * ===================================================================
 */

import { apiFetch } from "./apiClient.js";

// ==================================================
// FETCH USERS
// ==================================================

export async function fetchUsers(req, res) {

    return apiFetch("/api/users", {}, req, res);
}

// ==================================================
// FETCH USER BY ID
// ==================================================

export async function fetchUserById(id, req, res) {

    return apiFetch(`/api/users/${id}`, {}, req, res);
}

// ==================================================
// CREATE USER
// ==================================================

export async function createUser(data, req, res) {

    return apiFetch(
        "/api/users", {
            method: "POST",
            body: JSON.stringify(data)
            }, req, res
    );
}