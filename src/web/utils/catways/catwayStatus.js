export function buildCatwayStatus({ catwayState, isOutOfService }) {

    if (isOutOfService) {
        return {
            label: catwayState,
            className: "status--danger",
            aria: "Catway hors service, non réservable",
        };
    }

    if (catwayState === "bon état") {
        return {
            label: catwayState,
            className: "status--ok",
            aria: "Catway en bon état",
        };
    } 

    return {
        label: catwayState,
        className: "status--warning",
        aria: "Catway réservable nécessitant une attention",
    };
}