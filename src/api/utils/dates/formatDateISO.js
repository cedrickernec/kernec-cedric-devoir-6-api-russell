/**
 * ===================================================================
 * DATE FORMATTER - ISO
 * ===================================================================
 * - Convertit une date vers le format YYYY-MM-DD
 * ===================================================================
 */

export function formatDateISO(date) {
    
    if (!date) return null;

    const d = new Date(date);

    // Date invalide
    if (Number.isNaN(d.getTime())) return null;

    return d.toISOString().slice(0,10);
}