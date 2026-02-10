export function formatDateISO(date) {
    
    if (!date) return null;

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return null;

    return d.toISOString().slice(0,10);
}