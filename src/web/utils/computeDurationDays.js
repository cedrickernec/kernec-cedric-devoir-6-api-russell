/**
 * ===================================================================
 * COMPUTE DURATION
 * ===================================================================
 * - Durée en jours calendaires
 * - Inclusive (start + end)
 * ===================================================================
 */

export function computeDurationDays(startDate, endDate) {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if(isNaN(start) || isNaN(end)) return null;

    const diffMs = end-start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
}