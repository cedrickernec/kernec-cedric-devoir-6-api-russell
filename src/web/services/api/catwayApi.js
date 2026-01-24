/**
 * ===================================================================
 * CATWAY API
 * ===================================================================
 * - Récupération des catways dans l'API
 * ===================================================================
 */

// ==================================================
// FETCH CATWAYS
// ==================================================

export async function fetchCatways(token) {

    const res = await fetch("http://localhost:3000/api/catways", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return null;

    return res.json();
}

// ==================================================
// FETCH CATWAYS BY NUMBER
// ==================================================

export async function fetchCatwaysByNumber(number, token) {

    const res = await fetch(`http://localhost:3000/api/catways/${number}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return null;

    return res.json();
}