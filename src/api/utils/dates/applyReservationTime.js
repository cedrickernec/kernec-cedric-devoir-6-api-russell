/**
 * ===================================================================
 * APPLY RESERVATION TIME
 * ===================================================================
 * - Normalise l'heure d'une date :
 *      - Applique une heure standard à une date
 *      - Garantit une cohérence horaire pour les réservations
 *      - Évite les conflits liés aux heures variables
 * ===================================================================
 */

export function applyReservationTime(date) {
    const d = new Date(date);

    d.setHours(6, 0, 0, 0);

    return d;
}