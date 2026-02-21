/**
 * ===================================================================
 * USER API
 * ===================================================================
 * - Récupération des utilisateurs dans l'API
 * ===================================================================
 */

import { apiFetch } from "./apiFetch.js";

// ==================================================
// FETCH USERS
// ==================================================

export async function fetchUsers(req, res) {

    return apiFetch("/api/users", {
        method: "GET"
    }, req, res);
}

// ==================================================
// FETCH USER BY ID
// ==================================================

export async function fetchUserById(id, req, res) {

    return apiFetch(`/api/users/${id}`, {
        method: "GET"
    }, req, res);
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

// ==================================================
// UPDATE USER
// ==================================================

export async function updateUser(id, data, req, res) {

    return apiFetch(
        `/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }, req, res
    );
}

// ==================================================
// UPDATE USER (PASSWORD)
// ==================================================

export async function updatePassword(id, data, req, res) {

    return apiFetch(
        `/api/users/${id}/password`, {
            method: "PUT",
            body: JSON.stringify(data)
        }, req, res
    );
}

// ==================================================
// DELETE USER
// ==================================================

export async function deleteUser(id, req, res) {

    return apiFetch(
        `/api/users/${id}`, {
            method: "DELETE",
        }, req, res
    );
}