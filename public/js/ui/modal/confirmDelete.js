/**
 * ===================================================================
 * CONFIRM DELETE (MODAL)
 * ===================================================================
 * - Génère le contenu HTML de la modale de suppression
 * - Centralise les messages selon le type
 * - Gère le pluralize et les classes status
 * ===================================================================
 */

// Mapping entre le statut API et les classes CSS
function getStatusClass(statusKey) {
  const map = {
    "UPCOMING": "upcoming",
    "IN_PROGRESS": "active",
    "FINISHED": "past"
  };

  return map[statusKey] || "plain";
}

// Modale de confirmation de suppression
export function confirmDelete({
  type,
  count = 1,
  requirePassword = false,
  message = null,
  context = null
}) {

  const meta = {
    user: {
      article: "cet",
      singular: "utilisateur",
      plural: "utilisateurs"
    },

    catway: {
      article: "ce",
      singular: "catway",
      plural: "catways"
    },

    reservation: {
      article: "cette",
      singular: "réservation",
      plural: "réservations"
    }
  }

  const item = meta[type] || { article: "cet", singular: "élément", plural: "éléments" };

  const wrapper = document.createElement("div");

  const p = document.createElement("p");
  p.className = "modal-text";

  // ==================================================
  // CLASSIC CONFIRMATION (sans password)
  // ==================================================

  if (!requirePassword) {

    if (message) {
      p.textContent = message;
    } else {
      p.textContent = count > 1
        ? `Supprimer ${count} ${item.plural} ?`
        : `Supprimer ${item.article} ${item.singular} ?`;
    }

    wrapper.appendChild(p);

    return {
      node: wrapper,
      getPassword: () => null
    };
  }

  // ==================================================
  // PASSWORD REQUEST
  // ==================================================

  if (type === "reservation") {

    // ===== SUPPRESSION UNITAIRE =====
    if (count === 1 && context) {

      const statusClass = getStatusClass(context.status.key);

      wrapper.innerHTML = `
        <div class="modal-context">

          <p class="modal-context-subheader">
            Cette réservation est actuellement
            <span class="status status--${statusClass}">
              ${context.status.label}
            </span>.
          </p>

          <div class="modal-context-warning">
            <p class="bold">
              <i class="fa-solid fa-triangle-exclamation modal-context-icon"></i>
              Attention
            </p>
            <p class="italic">
              Cette action est irréversible et entraînera la suppression définitive de la réservation.
            </p>
          </div>

          <div class="modal-context-details-block">
            <p><span class="bold">Client :</span> ${context.clientName || "-"}</p>
            <p><span class="bold">Bateau :</span> ${context.boatName || "-"}</p>
            <p><span class="bold">Date de début :</span> ${context.startDate || "-"}</p>
            <p><span class="bold">Date de fin :</span> ${context.endDate || "-"}</p>
          </div>

          <p class="modal-context-small-info italic">
            Pour des raisons de sécurité, sa suppression nécessite une confirmation par mot de passe.
          </p>
        </div>
      `;
    }

    // ===== SUPPRESSION MULTIPLE =====
    else {
      wrapper.innerHTML = `
        <div class="modal-context">
          <p class="modal-context-subheader">
            La sélection comporte des réservations en cours ou terminées.
          </p>

          <div class="modal-context-warning">
            <p class="bold">
              <i class="fa-solid fa-triangle-exclamation modal-context-icon"></i>
              Attention
            </p>
            <p class="italic">
              Cette action est irréversible et entraînera la suppression définitive
              des réservations sélectionnées.
            </p>
          </div>

          <p class="modal-context-small-info italic">
            Pour des raisons de sécurité, ses suppressions nécessitent une confirmation par mot de passe.
          </p>
        </div>
      `;
    }
  }

  // ==================================================
  // SUPPRESSION CATWAY
  // ==================================================

  else if (type === "catway") {

    const stats = context?.reservationsStats || {};

    // ===== SUPPRESSION UNITAIRE =====
    if (count === 1 && context) {
      wrapper.innerHTML = `
        <div class="modal-context">

          <div class="modal-context-warning">
            <p class="bold">
              <i class="fa-solid fa-triangle-exclamation modal-context-icon"></i>
              Attention
            </p>
            <p class="italic">
              Vous êtes sur le point de supprimer définitivement un catway affilié à des réservations :
            </p>
          </div>

          <div class="modal-context-inline-block">
            <div class="modal-context-stat modal-context-stat--upcoming">
              <span class="modal-context-badge modal-context-badge--upcoming">
                ${stats.upComing || 0}
              </span>

              <span class="bold">À venir</span>
            </div>

            <div class="modal-context-stat modal-context-stat--active">
              <span class="modal-context-badge modal-context-badge--active">
                ${stats.inProgress || 0}
              </span>

              <span class="bold">En cours</span>
            </div>

            <div class="modal-context-stat modal-context-stat--past">
              <span class="modal-context-badge modal-context-badge--past">
                ${stats.finished || 0}
              </span>

              <span class="bold">Terminée${stats.finished > 1 ? "s" : ""}</span>
            </div>

          </div>

          <div class="modal-context-warning italic">
            <p>Cette action est irréversible et entraînera :</p>
            <ul class="modal-context-list">
              <li>la suppression de toutes les réservations associées</li>
              <li>l'indisponibilité du catway dans le système</li>
            </ul>
          </div>

          <p class="modal-context-small-info italic">
            Pour des raisons de sécurité, sa suppression nécessite une confirmation par mot de passe.
          </p>

        </div>
      `;
    }

    // ===== SUPPRESSION MULTIPLE =====
    else {
      wrapper.innerHTML = `
        <div class="modal-context">

          <div class="modal-context-warning">
            <p class="bold">
              <i class="fa-solid fa-triangle-exclamation modal-context-icon"></i>
              Attention
            </p>
            <p class="italic">
              La sélection contient un ou plusieurs catways affiliés à des réservations.
            </p>
          </div>

          <div class="modal-context-warning italic">
            <p>Cette action est irréversible et entraînera :</p>
            <ul class="modal-context-list">
              <li>la suppression de toutes les réservations associées</li>
              <li>l'indisponibilité des catways dans le système</li>
            </ul>
          </div>

          <p class="modal-context-small-info italic">
            Pour des raisons de sécurité, ses suppressions nécessitent une confirmation par mot de passe.
          </p>

        </div>
      `;
    }
  }

  // ==================================================
  // CAS PASSWORD GÉNÉRIQUE
  // ==================================================

  else {
    if (message) {
      p.textContent = message;
    } else {
      p.textContent = count > 1
        ? `Supprimer ${count} ${item.plural} ?`
        : `Supprimer ${item.article} ${item.singular} ?`;
    }

    wrapper.appendChild(p);
  }

  // ==================================================
  // PASSWORD FIELD
  // ==================================================

  const passwordInput = document.createElement("input");
  passwordInput.id = "password-confirm"
  passwordInput.type = "password";
  passwordInput.className = "modal-field";
  passwordInput.placeholder = "Mot de passe requis";

  passwordInput.addEventListener("input", () => {
    passwordInput.removeAttribute("data-invalid");
  });

  wrapper.appendChild(passwordInput);

  return {
    node: wrapper,
    getPassword: () => passwordInput.value || null
  };
}