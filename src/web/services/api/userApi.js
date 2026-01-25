/**
 * ===================================================================
 * CATWAY API
 * ===================================================================
 * - Récupération des catways dans l'API
 * ===================================================================
 */

// ==================================================
// FETCH USERS
// ==================================================

export async function fetchUsers(token) {

    const res = await fetch("http://localhost:3000/api/users", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (res.status === 401) {
        return { authExpired: true };
    }

    if (!res.ok) return null;

    return res.json();
}