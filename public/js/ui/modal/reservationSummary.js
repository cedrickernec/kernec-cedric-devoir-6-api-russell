/**
 * ===================================================================
 * RESERVATION SUMMARY CONTENT BUILDER
 * ===================================================================
 * - Génère le contenu DOM du récapitulatif de réservation avant submit
 * - Affiche :
 *          → informations client / bateau
 *          → liste des réservations sélectionnées
 *          → durée totale
 *          → avertissement en cas de chevauchement
 * ===================================================================
 */

export function reservationSummary({ data }) {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-context";

    // ==================================================
    // CONTEXT HEADER
    // ==================================================

    const header = document.createElement("p");
    header.className = "modal-context-subheader";
    header.innerHTML = `
        <span class="bold">Client :</span> ${data.clientName}
        <span class="muted"> | </span>
        <span class="bold">Bateau :</span> ${data.boatName}
    `;
    wrapper.appendChild(header);

    // ==================================================
    // OVERLAP DETECTION WARNING
    // ==================================================

    const hasOverlap = hasOverlappingReservations(data.reservations);

    if (hasOverlap) {
        const warning = document.createElement("div");
        warning.className = "modal-context-warning";
        warning.innerHTML = `
            <span class="bold"><i class="fa-solid fa-triangle-exclamation modal-context-icon"></i> Attention</span>
            <span class="italic">Certaines réservations sélectionnées se chevauchent dans le temps.
            Vérifiez que cela correspond bien à votre intention.</span>
        `;
        wrapper.appendChild(warning);
    }

    // ==================================================
    // RESERVATIONS LIST RENDERING
    // ==================================================

    const list = document.createElement("div");
    list.className = "modal-context-inline-block";

    data.reservations.forEach(r => {
        const row = document.createElement("div");
        row.className = `modal-context-item modal-context-item--${r.type}`;

        row.innerHTML = `
        <span class="modal-context-badge modal-context-badge--${r.type}">
            ${r.type === "full" ? "D" : "P"}
        </span>

        <span class="bold">
            Catway ${r.catway}
        </span>

        <span class="modal-context-date">
            ${r.startDate || "—"}
        </span>

        <span class="modal-context-date-separator"><i class="fa-solid fa-arrows-left-right"></i></span>

        <span class="modal-context-date">
            ${r.endDate || "—"}
        </span>

        <span class="modal-context-subtotal">
            ${typeof r.duration === "number"
                ? `${r.duration} nuit${r.duration > 1 ? "s" :""}`
                : "—"}
        </span>
        `;

        list.appendChild(row);
    });
    
    wrapper.appendChild(list);

    // ==================================================
    // TOTAL DURATION CALCULATION
    // ==================================================

    const totalNights = data.reservations.reduce((sum, r) => {
        return typeof r.duration === "number" ? sum + r.duration : sum;
    }, 0);

    const total = document.createElement("div");
    total.className = "modal-context-total";
    total.innerHTML = `
    <span class="bold">Total :</span> ${totalNights} nuit${totalNights > 1 ? "s" : ""}
    `;

    wrapper.appendChild(total);

    return wrapper;
}

// ==================================================
// OVERLAP DETECTION ALGORITHM
// (détecte si deux périodes se chevauchent)
// ==================================================

function hasOverlappingReservations(reservations) {
    const dated = reservations
        .filter(r => r.startDate !== "-" && r.endDate !== "-")
        .map(r => ({
            start: new Date(r.startDate.split("/").reverse().join("-")),
            end: new Date(r.endDate.split("/").reverse().join("-"))
        }));

    for (let i = 0; i < dated.length; i++) {
        for (let j = i + 1; j < dated.length; j++) {

            if (dated[i].start <= dated[j].end &&
                dated[j].start <= dated[i].end) {
                    return true;
            }
        }
    }

    return false;
}