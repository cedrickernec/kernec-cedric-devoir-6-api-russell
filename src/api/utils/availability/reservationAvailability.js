/**
 * ===================================================================
 * CATWAY COMPATIBILITY CALCULATION
 * ===================================================================
 * Règles :
 * - full    : aucun chevauchement, période entièrement disponible
 * - partial : une sous-période est disponible
 * - none    : aucun créneau compatible
 * 
 * Retour :
 * - none    → {status, slots}
 * - partial → {status, from, to}
 * - none    → {status, from, to, slots}
 * ===================================================================
 */

function dayStart(date) {
  const d = new Date(date);
  return new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate()
  ));
}

export function getCatwayCompatibility({
  catwayNumber,
  reservations,
  startDate,
  endDate
}) {
  // Période demandée (jours)
  const periodStart = dayStart(startDate);
  const periodEnd   = dayStart(endDate);

  // Réservations bloquantes du catway
  const blocked = reservations
    .filter(r => Number(r.catwayNumber) === Number(catwayNumber))
    .map(r => ({
      start: dayStart(r.startDate),
      end:   dayStart(r.endDate)
    }))
    .sort((a, b) => a.start - b.start);

  let cursor = new Date(periodStart);
  const slots = [];

  for (const b of blocked) {

    // Réservation hors période
    if (b.end <= periodStart || b.start >= periodEnd) {
      continue;
    }

    // Créneau disponible avant le blocage
    if (cursor < b.start) {

      const slotEnd = b.start < periodEnd ? b.start : periodEnd;

      if (cursor < slotEnd) {
        slots.push({
          from: new Date(cursor),
          to: new Date(slotEnd)
        });
      }
    }

    // Avancer le curseur
    if (b.end > cursor) {
      cursor = new Date(b.end);
    }
  }

  // Slot final
  if (cursor < periodEnd) {
    slots.push({
      from: new Date(cursor),
      to: new Date(periodEnd)
    });
  }

  // ======================================================
  // RÉSULTAT
  // ======================================================

  if (slots.length === 0) {
    return { status: "none", slots: [] };
  }

  // FULL: un seul slot qui couvre exactement la période demandée
  if (
    slots.length === 1 &&
    slots[0].from.getTime() === periodStart.getTime() &&
    slots[0].to.getTime() === periodEnd.getTime()
  ) {
    return {
      status: "full",
      from: periodStart,
      to: periodEnd
    };
  }

  // PARTIAL: renvoie tous les slots possibles dans la période
  return {
    status: "partial",
    slots
  };
}