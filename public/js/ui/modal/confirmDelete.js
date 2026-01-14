/**
 * ===================================================================
 * CONFIRM DELETE (MODAL)
 * ===================================================================
 * - Génère le contenu HTML de la modale de suppression
 * - Centralise les messages selon le type
 * ===================================================================
 */

export function confirmDelete({ type, count }) {
  const labels = {
    user: ["utilisateur", "utilisateurs"],
    catway: ["catway", "catways"],
    reservation: ["réservation", "réservations"]
  };

  const [singular, plural] = labels[type] || ["élément", "éléments"];
  const label = count > 1 ? plural : singular;

  const p = document.createElement("p")
  p.className = "modal-text";
  p.textContent = `Supprimer ${count} ${label} ?`;

  return p;
}