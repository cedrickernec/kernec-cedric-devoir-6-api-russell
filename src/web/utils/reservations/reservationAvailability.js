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
  d.setHours(0, 0, 0, 0);
  return d;
}

function nextDay(date) {
  const d = dayStart(date);
  d.setDate(d.getDate() + 1);
  return d;
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
    if (b.end < periodStart || b.start > periodEnd) {
      continue;
    }

    // Trou disponible avant le blocage
    if (cursor < b.start) {
      slots.push({
        from: new Date(cursor),
        to: new Date(b.start)
      });
    }

    // Saut au lendemain du dernier jour bloqué
    if (b.end >= cursor) {
      cursor = nextDay(b.end);
    }
  }

  // Trou final
  if (cursor <= periodEnd) {
    slots.push({
      from: new Date(cursor),
      to: nextDay(periodEnd)
    });
  }

  // ======================================================
  // RÉSULTAT
  // ======================================================

  if (slots.length === 0) {
    return { status: "none", slots: [] };
  }

  // Full si un seul slot = toute la période
  if (
    slots.length === 1 &&
    slots[0].from.getTime() === periodStart.getTime() &&
    slots[0].to.getTime() === nextDay(periodEnd).getTime()
  ) {
    return {
      status: "full",
      from: periodStart,
      to: periodEnd
    };
  }

  // Partial → plus long créneau
  const bestSlot = slots.reduce((a, b) =>
    (b.to - b.from) > (a.to - a.from) ? b : a
  );

  return {
    status: "partial",
    from: bestSlot.from,
    to: bestSlot.to,
    slots
  };
}