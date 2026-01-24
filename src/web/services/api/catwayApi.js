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

// ==================================================
// CREATE CATWAY
// ==================================================

export async function createCatway(data, token) {

    const res = await fetch("http://localhost:3000/api/catways", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) return null;

    return res.json();
}

// ==================================================
// UPDATE CATWAY
// ==================================================

export async function updateCatway(number, data, token) {

    const res = await fetch(`http://localhost:3000/api/catways/${number}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    if (!res.ok) return null;

    return res.json();
}