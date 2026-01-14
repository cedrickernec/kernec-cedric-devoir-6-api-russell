/**
 * ===================================================================
 * RESERVATION SUMMARY (CONTENT BUILDER)
 * ===================================================================
 * - Génère le contenu DOM du récapitulatif de réservation
 * ===================================================================
 */

export function reservationSummary({ data }) {
    const wrapper = document.createElement("div");
    wrapper.className = "modal-summary";

    /* ================= CONTEXT ================= */

    const header = document.createElement("p");
    header.className = "summary-context";
    header.innerHTML = `
        <span class="bold">Client :</span> ${data.clientName}
        <span class="muted"> | </span>
        <span class="bold">Bateau :</span> ${data.boatName}
    `;
    wrapper.appendChild(header);

    /* ================= OVERLAPPING MESSAGE ================= */

    const hasOverlap = hasOverlappingReservations(data.reservations);

    if (hasOverlap) {
        const warning = document.createElement("div");
        warning.className = "summary-warning";
        warning.innerHTML = `
            <span class="bold"><i class="fa-solid fa-triangle-exclamation summary-icon"></i> Attention</span><br>
            <span class="italic">Certaines réservations sélectionnées se chevauchent dans le temps.
            Vérifiez que cela correspond bien à votre intention.</span>
        `;
        wrapper.appendChild(warning);
    }

    /* ================= LIST ================= */

    const list = document.createElement("div");
    list.className = "summary-list";

    data.reservations.forEach(r => {
        const row = document.createElement("div");
        row.className = `summary-item summary-item--${r.type}`;

        row.innerHTML = `
        <span class="summary-badge summary-badge--${r.type}">
            ${r.type === "full" ? "D" : "P"}
        </span>

        <span class="summary-catway">
            Catway ${r.catway}
        </span>

        <span class="summary-date-start">
            ${r.startDate || "—"}
        </span>

        <span class="summary-arrow"><i class="fa-solid fa-arrows-left-right"></i></span>

        <span class="summary-date-end">
            ${r.endDate || "—"}
        </span>

        <span class="summary-duration">
            ${r.duration ? `${r.duration} jours` : "—"}
        </span>
        `;

        list.appendChild(row);
    });
    
    wrapper.appendChild(list);

    /* ================= TOTAL DURATION ================= */
    const totalDays = data.reservations.reduce((sum, r) => {
        return typeof r.duration === "number" ? sum + r.duration : sum;
    }, 0);

    const total = document.createElement("div");
    total.className = "summary-total";
    total.innerHTML = `
    <span class="bold">Total :</span> ${totalDays} jours
    `;

    wrapper.appendChild(total);

    return wrapper;
}

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