/**
 * ===================================================================
 * DATE & TIME FORMATTER (FR)
 * ===================================================================
 * - Centralise le formatage des dates/heures UI
 * - Sécurise les entrées invalides
 * - Garantit une cohérence d'affichage globale
 * ===================================================================
 */

// ==================================================
// SHORT DATE (JJ/MM/AAAA)
// ==================================================

export function formatDateFR(date) {
    if (!date) return "-";

    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

// ==================================================
// TIME (HH:MM:SS)
// ==================================================

export function formatTimeFR(date) {
    if (!date) return "-";

    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return "-";

    return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}