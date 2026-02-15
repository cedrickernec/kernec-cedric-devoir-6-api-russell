/**
 * ===================================================================
 * DATE FORMATTER
 * ===================================================================
 * - Formatage selon la locale française (fr-FR)
 * - Sécurise les valeurs nulles ou invalides
 * ===================================================================
 */

// ========================================================
// HELPERS
// ========================================================

/**
 * Vérifie et normalise une date
 * @param {Date|string|null} date 
 * @returns {Date|null}
 */

function normalizeDate(date) {
    if (!date) return null;

    const d = date instanceof Date ? date : new Date(date);
    return Number.isNaN(d.getTime()) ? null : d;
}

// ========================================================
// FORMATTERS
// ========================================================

// ===== SHORT DATE (JJ/MM/AAAA) =====

export function formatDateFR(date) {
    const d = normalizeDate(date);
    if (!d) return "-";

    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

// ===== LONG DATE (mercredi 07 janvier 2026) =====

export function formatDateLongFR(date) {
    const d = normalizeDate(date);
    if (!d) return "-";

    return d.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};

// ===== HOUR (HH:MM:SS) =====

export function formatTimeFR(date) {
    const d = normalizeDate(date);
    if (!date) return "-";

    return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};