/**
 * ===================================================================
 * CATWAY API
 * ===================================================================
 * - Récupération des catways dans l'API
 * ===================================================================
 */

export async function fetchCatways(token) {

    const res = await fetch("http://localhost:3000/api/catways", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return null;

    return res.json();
}